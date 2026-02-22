// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { readHeartbeat, readMemory, writeHeartbeat } from '../../../lib/memory'
import { getEnabledAgents, getAgent } from '../../../lib/agents'

export async function GET(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const agentId = request.nextUrl.searchParams.get('agent')

  if (agentId) {
    const agent = getAgent(agentId)
    if (!agent) {
      return NextResponse.json({ error: `Unknown agent: ${agentId}` }, { status: 400 })
    }

    const heartbeat = await readHeartbeat(agentId)
    const memory = await readMemory(agentId)

    return NextResponse.json({
      agent: agentId,
      heartbeat: heartbeat || null,
      memoryLength: memory ? memory.length : 0,
    })
  }

  // All agents
  const agents = getEnabledAgents()
  const statuses = await Promise.all(
    agents.map(async (agent) => {
      const heartbeat = await readHeartbeat(agent.id)
      const memory = await readMemory(agent.id)
      return {
        agent: agent.id,
        name: agent.name,
        heartbeat: heartbeat || null,
        memoryLength: memory ? memory.length : 0,
      }
    })
  )

  return NextResponse.json({ agents: statuses })
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

  await writeHeartbeat(body.agentId, body.content)
  return NextResponse.json({ ok: true })
}
