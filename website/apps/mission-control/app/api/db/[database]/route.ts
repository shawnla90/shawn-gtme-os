import { NextRequest, NextResponse } from 'next/server'
import { getTableList, getDbFileSize, getDbPath } from '../../../lib/db'

export const dynamic = 'force-dynamic'

const VALID_DBS = ['index', 'niobot', 'crm'] as const

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ database: string }> }
) {
  const { database } = await params

  if (!VALID_DBS.includes(database as typeof VALID_DBS[number])) {
    return NextResponse.json({ error: 'Invalid database' }, { status: 400 })
  }

  const dbName = database as typeof VALID_DBS[number]

  try {
    const tables = getTableList(dbName)
    const totalRows = tables.reduce((sum, t) => sum + t.count, 0)
    const fileSize = getDbFileSize(dbName)

    return NextResponse.json({
      name: dbName,
      path: getDbPath(dbName),
      tables,
      tableCount: tables.length,
      totalRows,
      fileSize,
    })
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to read database: ${(e as Error).message}` },
      { status: 500 }
    )
  }
}
