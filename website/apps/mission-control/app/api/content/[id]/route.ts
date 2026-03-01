import { NextRequest, NextResponse } from 'next/server'
import { markdownToHtml } from '@shawnos/shared/lib'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Try SQLite first (local dev)
  try {
    const { getDb } = require('../../../lib/db')
    const db = getDb('index')

    const row = db.prepare(
      `SELECT * FROM content WHERE id = ?`
    ).get(id) as Record<string, unknown> | undefined

    if (row) {
      let bodyHtml = ''
      if (row.body && typeof row.body === 'string') {
        bodyHtml = await markdownToHtml(row.body)
      }

      return NextResponse.json({
        ...row,
        body_html: bodyHtml,
      })
    }
  } catch {
    // DB not available — try static fallback
  }

  // Fallback: load from pre-built JSON (Vercel)
  try {
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'content-full.json')
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
      const item = (data.items || []).find((i: any) => String(i.id) === String(id))

      if (item) {
        let bodyHtml = ''
        if (item.body) {
          bodyHtml = await markdownToHtml(item.body)
        }

        return NextResponse.json({
          ...item,
          body_html: bodyHtml,
        })
      }
    }
  } catch {
    // Static data not available
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
