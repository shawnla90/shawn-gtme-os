// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { getEnabledAgents } from '../../../lib/agents'

export async function GET(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const agents = getEnabledAgents().map(a => ({
    id: a.id,
    name: a.name,
    description: a.description,
    avatar: a.avatar,
    accentColor: a.accentColor,
  }))

  return NextResponse.json({ agents })
}
