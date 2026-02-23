// NioBot V3 — GET /api/dna — Full DNA snapshot
// Called on client init: updates streak, returns full state for hydration

import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '../../../lib/auth'
import { getDNASnapshot, updateStreak, enrichSnapshot } from '../../../lib/db/queries/dna'

export async function GET(request: NextRequest) {
  if (!validateToken(request)) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Update streak (handles new-day logic)
    const streakResult = updateStreak()

    // Get full snapshot
    const snapshot = getDNASnapshot()
    if (!snapshot) {
      return NextResponse.json({ error: 'DNA state not found' }, { status: 500 })
    }

    // Enrich with computed fields
    const enriched = enrichSnapshot(snapshot)

    return NextResponse.json({
      ...enriched,
      streakResult,
    })
  } catch (err) {
    console.error('[dna] GET error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
