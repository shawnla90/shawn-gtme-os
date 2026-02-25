import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb('crm')

  const deal = db.prepare(`
    SELECT d.*, a.name as account_name,
      c.first_name || ' ' || COALESCE(c.last_name, '') as contact_name
    FROM deals d
    LEFT JOIN accounts a ON a.id = d.account_id
    LEFT JOIN contacts c ON c.id = d.contact_id
    WHERE d.id = ?
  `).get(id)

  if (!deal) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ deal })
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
    if (['account_id', 'contact_id', 'title', 'value_cents', 'stage', 'probability', 'expected_close_date', 'notes'].includes(key)) {
      fields.push(`${key} = ?`)
      values.push(val)
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  fields.push("updated_at = datetime('now')")
  values.push(id)

  db.prepare(`UPDATE deals SET ${fields.join(', ')} WHERE id = ?`).run(...values)

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb('crm')
  db.prepare('DELETE FROM deals WHERE id = ?').run(id)
  return NextResponse.json({ success: true })
}
