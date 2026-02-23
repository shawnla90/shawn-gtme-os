// NioBot V3 — GET/POST /api/dna/memory — Structured memory CRUD + search

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../../lib/auth'
import { insertMemory, getMemories, searchMemory } from '../../../../lib/db/queries/dna'

export async function GET(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const params = request.nextUrl.searchParams
  const query = params.get('q')
  const agentId = params.get('agent') || undefined
  const type = params.get('type') || undefined
  const minImportance = params.get('importance') ? parseFloat(params.get('importance')!) : undefined
  const limit = params.get('limit') ? parseInt(params.get('limit')!, 10) : 50

  try {
    let memories
    if (query) {
      memories = searchMemory(query, limit)
    } else {
      memories = getMemories({ agentId, type, limit, minImportance })
    }

    return NextResponse.json({ memories, count: memories.length })
  } catch (err) {
    console.error('[dna/memory] GET error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: {
    agentId: string
    type: string
    content: string
    tags?: string[]
    importance?: number
    source?: string
    conversationId?: string
    ttlMs?: number
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.agentId || !body.type || !body.content) {
    return NextResponse.json({ error: 'agentId, type, and content required' }, { status: 400 })
  }

  const validTypes = ['fact', 'preference', 'decision', 'task', 'summary']
  if (!validTypes.includes(body.type)) {
    return NextResponse.json({ error: `Invalid type. Valid: ${validTypes.join(', ')}` }, { status: 400 })
  }

  try {
    const id = crypto.randomUUID()
    insertMemory({
      id,
      agentId: body.agentId,
      type: body.type,
      content: body.content,
      tags: body.tags,
      importance: body.importance,
      source: body.source,
      conversationId: body.conversationId,
      ttlMs: body.ttlMs,
    })

    return NextResponse.json({ ok: true, id })
  } catch (err) {
    console.error('[dna/memory] POST error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
