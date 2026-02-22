// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { readMemory, writeMemorySnapshot } from '../../../lib/memory'
import { getAgent } from '../../../lib/agents'

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

  const memory = await readMemory(agentId)
  return NextResponse.json({ agent: agentId, memory: memory || null })
}

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { agentId: string; content: string }
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

  await writeMemorySnapshot(body.agentId, body.content)
  return NextResponse.json({ ok: true })
}
