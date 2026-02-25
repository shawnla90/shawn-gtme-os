import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

const VALID_DBS = ['index', 'niobot', 'crm'] as const

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ database: string }> }
) {
  const { database } = await params

  if (!VALID_DBS.includes(database as typeof VALID_DBS[number])) {
    return NextResponse.json({ error: 'Invalid database' }, { status: 400 })
  }

  try {
    const db = getDb(database as typeof VALID_DBS[number])
    const schemas = db.prepare(
      `SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
    ).all() as { name: string; sql: string }[]

    return NextResponse.json({ schemas })
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to read schema: ${(e as Error).message}` },
      { status: 500 }
    )
  }
}
