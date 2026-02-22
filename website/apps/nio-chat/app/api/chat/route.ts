import { NextRequest } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { spawnClaude } from '../../../lib/claude'
import type { ChatRequest } from '../../../lib/types'

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
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

      const child = spawnClaude(body.message, body.sessionId, {
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
