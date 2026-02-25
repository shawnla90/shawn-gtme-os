import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb('crm')

  const account = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id)
  if (!account) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const contacts = db.prepare('SELECT * FROM contacts WHERE account_id = ? ORDER BY is_primary DESC, created_at DESC').all(id)
  const deals = db.prepare('SELECT * FROM deals WHERE account_id = ? ORDER BY created_at DESC').all(id)
  const activities = db.prepare('SELECT * FROM activities WHERE account_id = ? ORDER BY created_at DESC LIMIT 50').all(id)
  const landingPages = db.prepare('SELECT * FROM landing_pages WHERE account_id = ? ORDER BY created_at DESC').all(id)

  return NextResponse.json({ account, contacts, deals, activities, landingPages })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const db = getDb('crm')

  const fields: string[] = []
  const values: unknown[] = []

  for (const [key, val] of Object.entries(body)) {
    if (['name', 'domain', 'industry', 'size', 'geography', 'source', 'stage', 'notes'].includes(key)) {
      fields.push(`${key} = ?`)
      values.push(val)
    }
    if (key === 'tags') {
      fields.push('tags = ?')
      values.push(JSON.stringify(val))
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  fields.push("updated_at = datetime('now')")
  values.push(id)

  db.prepare(`UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`).run(...values)

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb('crm')
  db.prepare('DELETE FROM accounts WHERE id = ?').run(id)
  return NextResponse.json({ success: true })
}
