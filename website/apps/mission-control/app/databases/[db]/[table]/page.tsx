import TableBrowser from '../../../components/TableBrowser'
import Link from 'next/link'

const DB_LABELS: Record<string, string> = {
  index: 'Content Index',
  niobot: 'NioBot',
  crm: 'CRM',
}

interface TablePageProps {
  params: Promise<{ db: string; table: string }>
}

export default async function TablePage({ params }: TablePageProps) {
  const { db, table } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/databases/" className="text-green-600 hover:text-green-400 transition-colors">
          Databases
        </Link>
        <span className="text-gray-600">/</span>
        <Link href={`/databases/${db}/`} className="text-green-600 hover:text-green-400 transition-colors">
          {DB_LABELS[db] || db}
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-green-300">{table}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">{table}</h1>
        <p className="text-sm text-gray-500">{DB_LABELS[db] || db} database</p>
      </div>

      <TableBrowser database={db} table={table} />
    </div>
  )
}
