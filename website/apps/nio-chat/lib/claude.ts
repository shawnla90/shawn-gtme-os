// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import type { AgentConfig } from './agents'

interface ClaudeCallbacks {
  onText: (text: string) => void
  onSessionId: (id: string) => void
  onDone: () => void
  onError: (error: string) => void
}

export function spawnClaude(
  message: string,
  sessionId: string | undefined,
  agent: AgentConfig,
  callbacks: ClaudeCallbacks
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

  child.stdout?.on('data', (chunk: Buffer) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const event = JSON.parse(line)

        // Capture session_id from init event
        if (event.type === 'system' && event.session_id && !capturedSessionId) {
          callbacks.onSessionId(event.session_id)
          capturedSessionId = true
        }

        // assistant event: message.content[].text has the full response
        if (event.type === 'assistant' && event.message) {
          const msg = event.message
          if (msg.content && Array.isArray(msg.content)) {
            for (const block of msg.content) {
              if (block.type === 'text' && typeof block.text === 'string') {
                callbacks.onText(block.text)
                sentText = true
              }
            }
          }
          if (event.session_id && !capturedSessionId) {
            callbacks.onSessionId(event.session_id)
            capturedSessionId = true
          }
        }

        // result event: has result string (fallback if assistant didn't fire)
        if (event.type === 'result') {
          if (!sentText && typeof event.result === 'string' && event.result.length > 0) {
            callbacks.onText(event.result)
          }
          if (event.session_id && !capturedSessionId) {
            callbacks.onSessionId(event.session_id)
            capturedSessionId = true
          }
        }
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
        const event = JSON.parse(buffer)
        if (event.type === 'result' && !sentText && typeof event.result === 'string' && event.result.length > 0) {
          callbacks.onText(event.result)
        }
        if (event.session_id && !capturedSessionId) {
          callbacks.onSessionId(event.session_id)
        }
      } catch {
        console.log(`[claude:${agent.id}] unparseable remaining buffer:`, buffer.substring(0, 200))
      }
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
