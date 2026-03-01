import { NextRequest, NextResponse } from 'next/server'
import { queryTable } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

const VALID_DBS = ['index', 'niobot', 'crm'] as const

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ database: string; table: string }> }
) {
  const { database, table } = await params
  const { searchParams } = req.nextUrl

  if (!VALID_DBS.includes(database as typeof VALID_DBS[number])) {
    return NextResponse.json({ error: 'Invalid database' }, { status: 400 })
  }

  const limit = parseInt(searchParams.get('limit') || '50', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)
  const search = searchParams.get('search') || ''
  const searchColumn = searchParams.get('searchColumn') || ''

  try {
    const result = queryTable(database as typeof VALID_DBS[number], table, {
      limit,
      offset,
      search,
      searchColumn,
    })

    return NextResponse.json(result)
  } catch (e) {
    console.error('Table query error:', (e as Error).message)
    return NextResponse.json(
      { error: 'Query failed' },
      { status: 500 }
    )
  }
}
