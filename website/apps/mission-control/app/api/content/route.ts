import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const platform = searchParams.get('platform') || ''
  const stage = searchParams.get('stage') || ''
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '50', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  const db = getDb('index')

  const conditions: string[] = []
  const params: unknown[] = []

  if (platform) {
    conditions.push('platform = ?')
    params.push(platform)
  }
  if (stage) {
    conditions.push('stage = ?')
    params.push(stage)
  }
  if (search) {
    conditions.push('(title LIKE ? OR body LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const countRow = db.prepare(
    `SELECT COUNT(*) as total FROM content ${where}`
  ).get(...params) as { total: number }

  const rows = db.prepare(
    `SELECT id, file_path, platform, stage, title, slug, date, word_count, created_at, updated_at
     FROM content ${where}
     ORDER BY COALESCE(date, updated_at, created_at) DESC
     LIMIT ? OFFSET ?`
  ).all(...params, limit, offset)

  // Get distinct platforms for filter tabs
  const platforms = db.prepare(
    `SELECT DISTINCT platform FROM content ORDER BY platform`
  ).all() as { platform: string }[]

  return NextResponse.json({
    items: rows,
    total: countRow.total,
    platforms: platforms.map((p) => p.platform),
    limit,
    offset,
  })
}
