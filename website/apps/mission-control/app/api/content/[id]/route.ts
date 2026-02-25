import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../lib/db'
import { markdownToHtml } from '@shawnos/shared/lib'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb('index')

  const row = db.prepare(
    `SELECT * FROM content WHERE id = ?`
  ).get(id) as Record<string, unknown> | undefined

  if (!row) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Render body as HTML
  let bodyHtml = ''
  if (row.body && typeof row.body === 'string') {
    bodyHtml = await markdownToHtml(row.body)
  }

  return NextResponse.json({
    ...row,
    body_html: bodyHtml,
  })
}
