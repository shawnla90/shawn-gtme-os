// NioBot V2 — Claude CLI subprocess spawner with usage tracking

import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import type { AgentConfig } from './agents'

export interface UsageData {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  model: string | null
}

interface ClaudeCallbacks {
  onText: (text: string) => void
  onSessionId: (id: string) => void
  onUsage: (usage: UsageData) => void
  onDone: () => void
  onError: (error: string) => void
}

export function spawnClaude(
  message: string,
  sessionId: string | undefined,
  agent: AgentConfig,
  callbacks: ClaudeCallbacks,
  modelOverride?: string
): ChildProcess {
  const soulPath = path.resolve(process.cwd(), agent.soulFile)

  const args = [
    '-p', message,
    '--output-format', 'stream-json',
    '--verbose',
    '--append-system-prompt-file', soulPath,
    '--max-turns', String(agent.maxTurns),
    '--permission-mode', 'bypassPermissions',
  ]

  if (modelOverride) {
    args.push('--model', modelOverride)
  }

  if (sessionId) {
    args.push('--resume', sessionId)
  }

  // Remove CLAUDECODE env var to avoid nested session error
  const env = { ...process.env }
  delete env.CLAUDECODE

  console.log(`[claude:${agent.id}] cwd:`, process.cwd())
  console.log(`[claude:${agent.id}] soul path:`, soulPath)
  console.log(`[claude:${agent.id}] args:`, args.join(' '))

  const child = spawn('/opt/homebrew/bin/claude', args, {
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let buffer = ''
  let stderrBuffer = ''
  let capturedSessionId = false
  let sentText = false

  // Accumulate usage across events
  const usage: UsageData = {
    inputTokens: 0,
    outputTokens: 0,
    cacheReadTokens: 0,
    cacheWriteTokens: 0,
    model: null,
  }

  function processEvent(event: Record<string, unknown>) {
    // Capture session_id from any event that has it
    if (typeof event.session_id === 'string' && !capturedSessionId) {
      callbacks.onSessionId(event.session_id)
      capturedSessionId = true
    }

    // Parse usage from assistant events
    if (event.type === 'assistant' && event.message) {
      const msg = event.message as Record<string, unknown>

      // Extract text
      if (msg.content && Array.isArray(msg.content)) {
        for (const block of msg.content as Array<Record<string, unknown>>) {
          if (block.type === 'text' && typeof block.text === 'string') {
            callbacks.onText(block.text)
            sentText = true
          }
        }
      }

      // Extract usage data
      if (msg.usage && typeof msg.usage === 'object') {
        const u = msg.usage as Record<string, unknown>
        if (typeof u.input_tokens === 'number') usage.inputTokens += u.input_tokens
        if (typeof u.output_tokens === 'number') usage.outputTokens += u.output_tokens
        if (typeof u.cache_read_input_tokens === 'number') usage.cacheReadTokens += u.cache_read_input_tokens
        if (typeof u.cache_creation_input_tokens === 'number') usage.cacheWriteTokens += u.cache_creation_input_tokens
      }

      // Extract model
      if (typeof msg.model === 'string') {
        usage.model = msg.model
      }
    }

    // result event: has result string (fallback if assistant didn't fire)
    if (event.type === 'result') {
      if (!sentText && typeof event.result === 'string' && (event.result as string).length > 0) {
        callbacks.onText(event.result as string)
      }

      // Result event sometimes has usage too
      if (event.usage && typeof event.usage === 'object') {
        const u = event.usage as Record<string, unknown>
        if (typeof u.input_tokens === 'number') usage.inputTokens = u.input_tokens
        if (typeof u.output_tokens === 'number') usage.outputTokens = u.output_tokens
      }

      if (typeof event.model === 'string') {
        usage.model = event.model as string
      }

      // Emit accumulated usage
      callbacks.onUsage(usage)
    }
  }

  child.stdout?.on('data', (chunk: Buffer) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        processEvent(JSON.parse(line))
      } catch {
        console.log(`[claude:${agent.id}] non-JSON stdout line:`, line.substring(0, 200))
      }
    }
  })

  child.stderr?.on('data', (chunk: Buffer) => {
    const text = chunk.toString()
    stderrBuffer += text
    console.error(`[claude:${agent.id} stderr]`, text.trim())
  })

  child.on('close', (code) => {
    console.log(`[claude:${agent.id}] process closed with code:`, code)
    if (stderrBuffer.trim()) {
      console.error(`[claude:${agent.id}] full stderr:`, stderrBuffer.trim())
    }

    // Process remaining buffer
    if (buffer.trim()) {
      try {
        processEvent(JSON.parse(buffer))
      } catch {
        console.log(`[claude:${agent.id}] unparseable remaining buffer:`, buffer.substring(0, 200))
      }
    }

    // Always emit final usage even if no result event
    if (usage.inputTokens > 0 || usage.outputTokens > 0) {
      callbacks.onUsage(usage)
    }

    if (code !== 0 && code !== null) {
      const errMsg = stderrBuffer.trim() || `claude process exited with code ${code}`
      callbacks.onError(errMsg)
    }
    callbacks.onDone()
  })

  child.on('error', (err) => {
    console.error(`[claude:${agent.id}] spawn error:`, err.message)
    callbacks.onError(err.message)
  })

  return child
}
