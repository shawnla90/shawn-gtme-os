// NioBot V3 — POST /api/dna/xp — Award XP (server-authoritative)
// Server validates source/amount, applies streak multiplier, checks daily flags

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../../lib/auth'
import { awardXP, claimDailyBonus, checkDailyFlag, setDailyFlag } from '../../../../lib/db/queries/dna'

const VALID_SOURCES = [
  'message sent', 'response received', 'daily bonus',
  'deep session (5+)', 'deep session (10+)', 'agent switch',
  'bootstrap',
]

const MAX_XP_PER_REQUEST = 200

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: {
    amount: number
    source: string
    skillId?: string
    agentId?: string
    conversationId?: string
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Validate
  if (typeof body.amount !== 'number' || body.amount <= 0 || body.amount > MAX_XP_PER_REQUEST) {
    return NextResponse.json({ error: `amount must be 1-${MAX_XP_PER_REQUEST}` }, { status: 400 })
  }

  if (!body.source || !VALID_SOURCES.includes(body.source)) {
    return NextResponse.json({ error: `Invalid source. Valid: ${VALID_SOURCES.join(', ')}` }, { status: 400 })
  }

  // Handle daily bonus via server flag
  if (body.source === 'daily bonus') {
    const result = claimDailyBonus()
    if (!result.claimed) {
      return NextResponse.json({ error: 'Daily bonus already claimed', alreadyClaimed: true }, { status: 409 })
    }
  }

  // Handle deep conversation flags (once per day on server)
  if (body.source === 'deep session (5+)') {
    if (checkDailyFlag('deep_convo')) {
      return NextResponse.json({ error: 'Deep convo bonus already claimed today', alreadyClaimed: true }, { status: 409 })
    }
    setDailyFlag('deep_convo')
  }

  if (body.source === 'deep session (10+)') {
    if (checkDailyFlag('very_deep_convo')) {
      return NextResponse.json({ error: 'Very deep convo bonus already claimed today', alreadyClaimed: true }, { status: 409 })
    }
    setDailyFlag('very_deep_convo')
  }

  try {
    const result = awardXP({
      amount: body.amount,
      source: body.source,
      skillId: body.skillId,
      agentId: body.agentId,
      conversationId: body.conversationId,
    })

    return NextResponse.json(result)
  } catch (err) {
    console.error('[dna/xp] POST error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
