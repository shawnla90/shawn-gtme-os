import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const stage = searchParams.get('stage') || ''
  const search = searchParams.get('search') || ''

  const db = getDb('crm')
  const conditions: string[] = []
  const params: unknown[] = []

  if (stage) {
    conditions.push('stage = ?')
    params.push(stage)
  }
  if (search) {
    conditions.push('(name LIKE ? OR domain LIKE ? OR notes LIKE ?)')
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const accounts = db.prepare(`
    SELECT a.*,
      (SELECT COUNT(*) FROM contacts c WHERE c.account_id = a.id) as contact_count,
      (SELECT COUNT(*) FROM deals d WHERE d.account_id = a.id) as deal_count,
      (SELECT COALESCE(SUM(value_cents), 0) FROM deals d WHERE d.account_id = a.id AND d.stage NOT IN ('closed_lost')) as pipeline_value
    FROM accounts a ${where}
    ORDER BY a.updated_at DESC
  `).all(...params)

  return NextResponse.json({ accounts })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = getDb('crm')

  const result = db.prepare(`
    INSERT INTO accounts (name, domain, industry, size, geography, source, stage, tags, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.name,
    body.domain || null,
    body.industry || null,
    body.size || null,
    body.geography || null,
    body.source || null,
    body.stage || 'prospect',
    JSON.stringify(body.tags || []),
    body.notes || null
  )

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 })
}
