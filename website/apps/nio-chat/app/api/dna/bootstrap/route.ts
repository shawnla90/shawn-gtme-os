// NioBot V3 — POST /api/dna/bootstrap — One-time localStorage migration
// Only writes if DB is at defaults (xp == 0)

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../../lib/auth'
import { bootstrapFromLocalStorage } from '../../../../lib/db/queries/dna'

export async function POST(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: {
    xp: number
    skillXP: Record<string, number>
    streak: number
    lastActiveDate: string | null
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof body.xp !== 'number' || typeof body.streak !== 'number') {
    return NextResponse.json({ error: 'xp and streak must be numbers' }, { status: 400 })
  }

  if (!body.skillXP || typeof body.skillXP !== 'object') {
    return NextResponse.json({ error: 'skillXP object required' }, { status: 400 })
  }

  try {
    const migrated = bootstrapFromLocalStorage({
      xp: body.xp,
      skillXP: body.skillXP,
      streak: body.streak,
      lastActiveDate: body.lastActiveDate,
    })

    return NextResponse.json({ ok: true, migrated })
  } catch (err) {
    console.error('[dna/bootstrap] POST error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
