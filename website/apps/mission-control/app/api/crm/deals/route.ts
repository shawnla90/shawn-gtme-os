import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const stage = searchParams.get('stage') || ''
  const accountId = searchParams.get('account_id') || ''

  const db = getDb('crm')
  const conditions: string[] = []
  const params: unknown[] = []

  if (stage) {
    conditions.push('d.stage = ?')
    params.push(stage)
  }
  if (accountId) {
    conditions.push('d.account_id = ?')
    params.push(accountId)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const deals = db.prepare(`
    SELECT d.*, a.name as account_name,
      c.first_name || ' ' || COALESCE(c.last_name, '') as contact_name
    FROM deals d
    LEFT JOIN accounts a ON a.id = d.account_id
    LEFT JOIN contacts c ON c.id = d.contact_id
    ${where}
    ORDER BY d.created_at DESC
  `).all(...params)

  return NextResponse.json({ deals })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = getDb('crm')

  const result = db.prepare(`
    INSERT INTO deals (account_id, contact_id, title, value_cents, stage, probability, expected_close_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.account_id,
    body.contact_id || null,
    body.title,
    body.value_cents || 0,
    body.stage || 'discovery',
    body.probability || 0,
    body.expected_close_date || null,
    body.notes || null
  )

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 })
}
