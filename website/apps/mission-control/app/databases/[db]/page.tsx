import { getTableList, getDb } from '../../lib/db'
import SchemaViewer from '../../components/SchemaViewer'
import Link from 'next/link'
import { Database } from 'lucide-react'

export const dynamic = 'force-dynamic'

const VALID_DBS = ['index', 'niobot', 'crm'] as const
const DB_LABELS: Record<string, string> = {
  index: 'Content Index',
  niobot: 'NioBot',
  crm: 'CRM',
}

interface DbDetailProps {
  params: Promise<{ db: string }>
}

export default async function DbDetailPage({ params }: DbDetailProps) {
  const { db: dbName } = await params

  if (!VALID_DBS.includes(dbName as typeof VALID_DBS[number])) {
    return (
      <div className="space-y-6">
        <Link href="/databases/" className="text-sm text-green-600 hover:text-green-400">
          &larr; Back to Databases
        </Link>
        <div className="card text-center py-12 text-gray-500">Invalid database: {dbName}</div>
      </div>
    )
  }

  const typedDb = dbName as typeof VALID_DBS[number]
  const tables = getTableList(typedDb)

  // Get schemas
  const db = getDb(typedDb)
  const schemas = db.prepare(
    `SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
  ).all() as { name: string; sql: string }[]

  return (
    <div className="space-y-6">
      <Link href="/databases/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
        &larr; Back to Databases
      </Link>

      <div className="flex items-center gap-3">
        <Database className="w-6 h-6 text-green-400" />
        <div>
          <h1 className="text-2xl font-bold text-green-300">{DB_LABELS[dbName] || dbName}</h1>
          <p className="text-sm text-gray-500">{tables.length} tables &middot; {tables.reduce((s, t) => s + t.count, 0).toLocaleString()} total rows</p>
        </div>
      </div>

      {/* Tables list */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider">Tables</h2>
        {tables.map((t) => (
          <Link key={t.name} href={`/databases/${dbName}/${t.name}/`} className="block group">
            <div className="card hover:bg-gray-800 transition-colors flex items-center justify-between">
              <span className="text-sm text-green-300 font-medium">{t.name}</span>
              <span className="text-xs text-gray-500">{t.count.toLocaleString()} rows</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Schema */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider">Schema</h2>
        <SchemaViewer schemas={schemas} />
      </div>
    </div>
  )
}
