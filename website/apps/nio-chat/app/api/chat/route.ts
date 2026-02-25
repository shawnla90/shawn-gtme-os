// NioBot V3 — Chat API route with SSE streaming, usage tracking, and evolution-aware prompts
// Phase 4 DNA: persists messages, reads evolution from DB, tracks costs

import { NextRequest } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { spawnClaude, type EvolutionContext } from '../../../lib/claude'
import { getAgent } from '../../../lib/agents'
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit'
import { logChatRequest } from '../../../lib/audit'
import { calculateCost } from '../../../lib/pricing'
import type { ChatRequest } from '../../../lib/types'
import { createConversation, getConversationBySession, insertMessage, updateConversation, upsertDailyCost } from '../../../lib/db/queries/conversations'
import { getDNAState, recordChatTurn } from '../../../lib/db/queries/dna'

const MAX_MESSAGE_LENGTH = 10_000

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const ip = getClientIP(request)

  // Rate limit: 30 requests per minute
  const { allowed } = checkRateLimit(`chat:${ip}`, 30)
  if (!allowed) {
    return new Response('Too many requests. Slow down.', { status: 429 })
  }

  let body: ChatRequest
  try {
    body = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  if (!body.message?.trim()) {
    return new Response('Message required', { status: 400 })
  }

  // Input length limit
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return new Response(`Message too long. Max ${MAX_MESSAGE_LENGTH} characters.`, { status: 413 })
  }

  // Resolve agent
  const agentId = body.agentId || 'nio'
  const agent = getAgent(agentId)

  if (!agent) {
    return new Response(`Unknown agent: ${agentId}`, { status: 400 })
  }

  if (!agent.enabled) {
    return new Response(`Agent ${agentId} is not enabled`, { status: 400 })
  }

  // Read evolution from DNA (server-authoritative — replaces client-sent evolutionTier)
  let evolution: EvolutionContext | undefined
  try {
    const dnaState = getDNAState()
    if (dnaState && dnaState.tier >= 1 && dnaState.tier <= 5) {
      // Build skill levels from skill XP
      const skillLevels: Record<string, number> = {}
      for (const [skillId, xp] of Object.entries(dnaState.skillXP)) {
        let level = 1
        let acc = 0
        for (let l = 1; l <= 10; l++) {
          if (xp >= acc + 100 * l) { acc += 100 * l; level = l + 1 } else break
        }
        skillLevels[skillId] = Math.min(level, 10)
      }
      evolution = { tier: dnaState.tier, skillLevels }
    }
  } catch (err) {
    console.error('[chat] DNA read error (falling back to no evolution):', err)
  }

  // Create or fetch conversation
  let conversationId: string | undefined
  try {
    if (body.sessionId) {
      const existing = getConversationBySession(body.sessionId)
      if (existing) {
        conversationId = existing.id
      }
    }
    if (!conversationId) {
      const conv = createConversation({
        id: crypto.randomUUID(),
        sessionId: body.sessionId,
        agentId,
        title: body.message.substring(0, 100),
      })
      conversationId = conv.id
    }
  } catch (err) {
    console.error('[chat] conversation creation error:', err)
    // Non-fatal — continue without persistence
  }

  // Persist user message
  const userMsgId = crypto.randomUUID()
  try {
    if (conversationId) {
      insertMessage({
        id: userMsgId,
        conversationId,
        role: 'user',
        content: body.message,
        agentId,
      })
    }
  } catch (err) {
    console.error('[chat] user message insert error:', err)
  }

  // Audit log (fire-and-forget)
  logChatRequest(ip, agentId, body.message.length)

  const encoder = new TextEncoder()

  // Accumulate full response text for persistence
  let fullResponseText = ''

  const HEARTBEAT_INTERVAL_MS = 15_000 // 15 seconds — keeps proxies from closing idle SSE

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      function send(data: string) {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {
          closed = true
        }
      }

      function close() {
        if (closed) return
        closed = true
        clearInterval(heartbeatInterval)
        try {
          controller.close()
        } catch {
          // already closed
        }
      }

      // Heartbeat: prevent Cloudflare Tunnel / browser proxies from closing idle connections
      const heartbeatInterval = setInterval(() => {
        send(JSON.stringify({ type: 'heartbeat' }))
      }, HEARTBEAT_INTERVAL_MS)

      const child = spawnClaude(body.message, body.sessionId, agent, {
        onText(text) {
          fullResponseText += text
          send(JSON.stringify({ type: 'text', data: text }))
        },
        onSessionId(id) {
          send(JSON.stringify({ type: 'session', data: id }))

          // Update conversation with session ID if we don't have one yet
          if (conversationId && body.sessionId !== id) {
            try {
              updateConversation(conversationId, { sessionId: id })
            } catch { /* non-fatal */ }
          }
        },
        onUsage(usage) {
          const cost = calculateCost(
            usage.model || 'claude-opus-4-6',
            usage.inputTokens,
            usage.outputTokens
          )
          send(JSON.stringify({
            type: 'usage',
            data: JSON.stringify({
              inputTokens: usage.inputTokens,
              outputTokens: usage.outputTokens,
              cacheReadTokens: usage.cacheReadTokens,
              cacheWriteTokens: usage.cacheWriteTokens,
              cost,
              model: usage.model,
            }),
          }))

          // Persist costs
          try {
            const model = usage.model || 'claude-opus-4-6'
            const costCents = cost * 100

            upsertDailyCost({
              agentId,
              model,
              inputTokens: usage.inputTokens,
              outputTokens: usage.outputTokens,
              costCents,
            })

            if (conversationId) {
              recordChatTurn({
                conversationId,
                agentId,
                model,
                inputTokens: usage.inputTokens,
                outputTokens: usage.outputTokens,
                costCents,
              })
            }
          } catch (err) {
            console.error('[chat] cost tracking error:', err)
          }
        },
        onDone() {
          // Persist assistant message
          try {
            if (conversationId && fullResponseText.trim()) {
              insertMessage({
                id: crypto.randomUUID(),
                conversationId,
                role: 'assistant',
                content: fullResponseText,
                agentId,
              })
            }
          } catch (err) {
            console.error('[chat] assistant message insert error:', err)
          }

          // Send conversationId back to client in done event
          send(JSON.stringify({ type: 'done', data: conversationId || '' }))
          close()
        },
        onError(msg) {
          send(JSON.stringify({ type: 'error', data: msg }))
          close()
        },
      }, undefined, evolution)

      // Kill child process on client abort
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        child.kill('SIGTERM')
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
