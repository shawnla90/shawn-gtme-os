import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const accountId = searchParams.get('account_id') || ''
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  const db = getDb('crm')

  let sql = `
    SELECT act.*, a.name as account_name,
      c.first_name || ' ' || COALESCE(c.last_name, '') as contact_name
    FROM activities act
    LEFT JOIN accounts a ON a.id = act.account_id
    LEFT JOIN contacts c ON c.id = act.contact_id
  `
  const params: unknown[] = []

  if (accountId) {
    sql += ' WHERE act.account_id = ?'
    params.push(accountId)
  }

  sql += ' ORDER BY act.created_at DESC LIMIT ?'
  params.push(limit)

  const activities = db.prepare(sql).all(...params)

  return NextResponse.json({ activities })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = getDb('crm')

  const result = db.prepare(`
    INSERT INTO activities (account_id, contact_id, deal_id, type, title, body, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.account_id || null,
    body.contact_id || null,
    body.deal_id || null,
    body.type,
    body.title,
    body.body || null,
    JSON.stringify(body.metadata || {})
  )

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 })
}
