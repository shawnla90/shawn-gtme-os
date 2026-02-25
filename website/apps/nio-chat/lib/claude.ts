// NioBot V3 — Claude CLI subprocess spawner with usage tracking + evolution-aware prompts

import { spawn, ChildProcess } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import type { AgentConfig } from './agents'
import { getMemories } from './db/queries/dna'

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

export interface EvolutionContext {
  tier: number
  skillLevels: Record<string, number>
}

// Compose the system prompt by combining base soul + tier fragment + skill mastery
function composeSoulPrompt(agent: AgentConfig, evolution?: EvolutionContext): string {
  const baseSoulPath = path.resolve(process.cwd(), agent.soulFile)
  let soul = ''

  try {
    soul = readFileSync(baseSoulPath, 'utf-8')
  } catch {
    console.error(`[claude:${agent.id}] failed to read soul file: ${baseSoulPath}`)
    return ''
  }

  if (!evolution) return soul

  // Append tier evolution fragment
  const tierFiles: Record<number, string> = {
    1: 'tier-1-spark.md',
    2: 'tier-2-blade.md',
    3: 'tier-3-warden.md',
    4: 'tier-4-sentinel.md',
    5: 'tier-5-ascended.md',
  }

  const tierFile = tierFiles[evolution.tier]
  if (tierFile) {
    const tierPath = path.resolve(process.cwd(), 'souls/evolution', tierFile)
    if (existsSync(tierPath)) {
      try {
        const fragment = readFileSync(tierPath, 'utf-8')
        soul += '\n\n' + fragment
      } catch {
        console.error(`[claude:${agent.id}] failed to read tier fragment: ${tierPath}`)
      }
    }
  }

  // Append skill mastery fragments for high-level skills (5+)
  for (const [skillId, level] of Object.entries(evolution.skillLevels)) {
    if (level >= 5) {
      soul += `\n\n## Skill Mastery: ${skillId} (lv.${level})\nYou have deep expertise in ${skillId}. Apply domain knowledge confidently. Suggest advanced patterns and optimizations in this area.`
    }
  }

  // Inject recent session memories (last 5) so Nio has context across new chats
  try {
    const memories = getMemories({ agentId: agent.id, type: 'session_summary', limit: 5 })
    if (memories.length > 0) {
      soul += '\n\n## Recent Session Memory\n\nThese are summaries from recent conversations. Use them for context continuity.\n\n'
      soul += memories.map(m => m.content).join('\n\n---\n\n')
    }
  } catch {
    // Non-fatal — memories are a bonus, not required
  }

  return soul
}

const INACTIVITY_TIMEOUT_MS = 180_000 // 3 minutes — kill child if no stdout activity

export function spawnClaude(
  message: string,
  sessionId: string | undefined,
  agent: AgentConfig,
  callbacks: ClaudeCallbacks,
  modelOverride?: string,
  evolution?: EvolutionContext
): ChildProcess {
  // Compose the full soul prompt with evolution fragments
  const composedSoul = composeSoulPrompt(agent, evolution)

  // Write composed soul to a temp file for --append-system-prompt-file
  const tmpDir = path.resolve(process.cwd(), '.tmp')
  const tmpSoulPath = path.resolve(tmpDir, `soul-${agent.id}-${Date.now()}.md`)

  try {
    const { mkdirSync, writeFileSync } = require('fs')
    mkdirSync(tmpDir, { recursive: true })
    writeFileSync(tmpSoulPath, composedSoul, 'utf-8')
  } catch (err) {
    console.error(`[claude:${agent.id}] failed to write temp soul file:`, err)
  }

  const args = [
    '-p', message,
    '--output-format', 'stream-json',
    '--verbose',
    '--append-system-prompt-file', tmpSoulPath,
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
  console.log(`[claude:${agent.id}] soul path:`, tmpSoulPath)
  console.log(`[claude:${agent.id}] evolution:`, evolution ? `tier=${evolution.tier}` : 'none')
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

  // Inactivity timeout — kill child if no stdout for 3 minutes
  let inactivityTimer: ReturnType<typeof setTimeout> | null = null

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    inactivityTimer = setTimeout(() => {
      console.error(`[claude:${agent.id}] inactivity timeout (${INACTIVITY_TIMEOUT_MS / 1000}s no output) — killing process`)
      child.kill('SIGTERM')
      // Give it 5s to clean up, then force kill
      setTimeout(() => {
        if (!child.killed) child.kill('SIGKILL')
      }, 5000)
    }, INACTIVITY_TIMEOUT_MS)
  }

  function clearInactivityTimer() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }
  }

  // Start the timer immediately
  resetInactivityTimer()

  child.stdout?.on('data', (chunk: Buffer) => {
    resetInactivityTimer() // Reset on every chunk

    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() || '' // Keep incomplete last line in buffer

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        processEvent(JSON.parse(line))
      } catch {
        // Debug log for partial/non-JSON lines — helps diagnose future truncation issues
        console.log(`[claude:${agent.id}] non-JSON stdout line (${line.length} chars):`, line.substring(0, 200))
      }
    }
  })

  child.stderr?.on('data', (chunk: Buffer) => {
    const text = chunk.toString()
    stderrBuffer += text
    console.error(`[claude:${agent.id} stderr]`, text.trim())
  })

  child.on('close', (code) => {
    clearInactivityTimer()
    console.log(`[claude:${agent.id}] process closed with code:`, code)
    if (stderrBuffer.trim()) {
      console.error(`[claude:${agent.id}] full stderr:`, stderrBuffer.trim())
    }

    // Process remaining buffer — this catches the last line if it didn't end with \n
    if (buffer.trim()) {
      try {
        processEvent(JSON.parse(buffer))
      } catch {
        console.log(`[claude:${agent.id}] unparseable remaining buffer (${buffer.length} chars):`, buffer.substring(0, 200))
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

    // Clean up temp soul file
    try {
      const { unlinkSync } = require('fs')
      unlinkSync(tmpSoulPath)
    } catch { /* ignore */ }
  })

  child.on('error', (err) => {
    clearInactivityTimer()
    console.error(`[claude:${agent.id}] spawn error:`, err.message)
    callbacks.onError(err.message)
  })

  return child
}
