// NioBot V3 — Memory API route
// DNA Phase 6: uses DNA query layer for structured memory, keeps flat-file dual-write

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { readMemory, writeMemorySnapshot } from '../../../lib/memory'
import { getAgent } from '../../../lib/agents'
import { insertMemory, getMemories, searchMemory } from '../../../lib/db/queries/dna'

export async function GET(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const agentId = request.nextUrl.searchParams.get('agent')
  if (!agentId) {
    return NextResponse.json({ error: 'agent query param required' }, { status: 400 })
  }

  const agent = getAgent(agentId)
  if (!agent) {
    return NextResponse.json({ error: `Unknown agent: ${agentId}` }, { status: 400 })
  }

  const query = request.nextUrl.searchParams.get('q')

  // If search query, use FTS5
  if (query) {
    try {
      const memories = searchMemory(query, 20)
      return NextResponse.json({ agent: agentId, memories, count: memories.length })
    } catch (err) {
      console.error('[memory] search error:', err)
      // Fall back to flat file
      const memory = await readMemory(agentId)
      return NextResponse.json({ agent: agentId, memory: memory || null })
    }
  }

  // Default: return structured memories from DB + flat file
  try {
    const memories = getMemories({ agentId, limit: 50 })
    const flatMemory = await readMemory(agentId)
    return NextResponse.json({
      agent: agentId,
      memory: flatMemory || null,
      memories,
      count: memories.length,
    })
  } catch (err) {
    console.error('[memory] DB read error:', err)
    // Fall back to flat file only
    const memory = await readMemory(agentId)
    return NextResponse.json({ agent: agentId, memory: memory || null })
  }
}

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { agentId: string; content: string; type?: string; tags?: string[]; importance?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.agentId || !body.content) {
    return NextResponse.json({ error: 'agentId and content required' }, { status: 400 })
  }

  const agent = getAgent(body.agentId)
  if (!agent) {
    return NextResponse.json({ error: `Unknown agent: ${body.agentId}` }, { status: 400 })
  }

  // Dual-write: flat file + SQLite
  try {
    await writeMemorySnapshot(body.agentId, body.content)
  } catch (err) {
    console.error('[memory] flat file write error:', err)
  }

  try {
    insertMemory({
      id: crypto.randomUUID(),
      agentId: body.agentId,
      type: body.type || 'summary',
      content: body.content,
      tags: body.tags,
      importance: body.importance,
      source: 'api',
    })
  } catch (err) {
    console.error('[memory] DB insert error:', err)
  }

  return NextResponse.json({ ok: true })
}
