import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const accountId = searchParams.get('account_id') || ''
  const search = searchParams.get('search') || ''

  const db = getDb('crm')
  const conditions: string[] = []
  const params: unknown[] = []

  if (accountId) {
    conditions.push('c.account_id = ?')
    params.push(accountId)
  }
  if (search) {
    conditions.push('(c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ?)')
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const contacts = db.prepare(`
    SELECT c.*, a.name as account_name
    FROM contacts c
    LEFT JOIN accounts a ON a.id = c.account_id
    ${where}
    ORDER BY c.created_at DESC
  `).all(...params)

  return NextResponse.json({ contacts })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const db = getDb('crm')

  const result = db.prepare(`
    INSERT INTO contacts (account_id, first_name, last_name, email, phone, role, persona, is_primary, linkedin_url, source, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    body.account_id,
    body.first_name,
    body.last_name || null,
    body.email || null,
    body.phone || null,
    body.role || null,
    body.persona || null,
    body.is_primary ? 1 : 0,
    body.linkedin_url || null,
    body.source || null,
    body.notes || null
  )

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 })
}
