// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { NextRequest } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { spawnClaude } from '../../../lib/claude'
import { getAgent } from '../../../lib/agents'
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit'
import { logChatRequest } from '../../../lib/audit'
import type { ChatRequest } from '../../../lib/types'

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

  // Audit log (fire-and-forget)
  logChatRequest(ip, agentId, body.message.length)

  const encoder = new TextEncoder()

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
        try {
          controller.close()
        } catch {
          // already closed
        }
      }

      const child = spawnClaude(body.message, body.sessionId, agent, {
        onText(text) {
          send(JSON.stringify({ type: 'text', data: text }))
        },
        onSessionId(id) {
          send(JSON.stringify({ type: 'session', data: id }))
        },
        onDone() {
          send(JSON.stringify({ type: 'done', data: '' }))
          close()
        },
        onError(msg) {
          send(JSON.stringify({ type: 'error', data: msg }))
          close()
        },
      })

      // Kill child process on client abort
      request.signal.addEventListener('abort', () => {
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
