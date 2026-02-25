import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb('crm')

  const contact = db.prepare(`
    SELECT c.*, a.name as account_name
    FROM contacts c
    LEFT JOIN accounts a ON a.id = c.account_id
    WHERE c.id = ?
  `).get(id)

  if (!contact) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ contact })
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
    if (['account_id', 'first_name', 'last_name', 'email', 'phone', 'role', 'persona', 'linkedin_url', 'source', 'notes'].includes(key)) {
      fields.push(`${key} = ?`)
      values.push(val)
    }
    if (key === 'is_primary') {
      fields.push('is_primary = ?')
      values.push(val ? 1 : 0)
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  fields.push("updated_at = datetime('now')")
  values.push(id)

  db.prepare(`UPDATE contacts SET ${fields.join(', ')} WHERE id = ?`).run(...values)

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb('crm')
  db.prepare('DELETE FROM contacts WHERE id = ?').run(id)
  return NextResponse.json({ success: true })
}
