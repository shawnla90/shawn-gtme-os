import { getTableList, getDbFileSize, getDbPath } from '../lib/db'
import Link from 'next/link'
import { Database, HardDrive } from 'lucide-react'

export const dynamic = 'force-dynamic'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

function getKeyMetrics(dbName: 'index' | 'niobot' | 'crm'): { label: string; value: string }[] {
  try {
    if (dbName === 'index') {
      const { getDb } = require('../lib/db')
      const db = getDb('index')
      const content = db.prepare('SELECT COUNT(*) as c FROM content').get() as { c: number }
      const assets = db.prepare('SELECT COUNT(*) as c FROM assets').get() as { c: number }
      const logs = db.prepare('SELECT COUNT(*) as c FROM daily_logs').get() as { c: number }
      return [
        { label: 'Content Items', value: String(content.c) },
        { label: 'Assets', value: String(assets.c) },
        { label: 'Daily Logs', value: String(logs.c) },
      ]
    }
    if (dbName === 'niobot') {
      const { getDb } = require('../lib/db')
      const db = getDb('niobot')
      const msgs = db.prepare('SELECT COUNT(*) as c FROM messages').get() as { c: number }
      const convos = db.prepare('SELECT COUNT(*) as c FROM conversations').get() as { c: number }
      let xp = 0
      try {
        const dna = db.prepare('SELECT xp FROM dna_state WHERE user_id = ?').get('default') as { xp: number } | undefined
        xp = dna?.xp ?? 0
      } catch { /* table might not exist */ }
      return [
        { label: 'Messages', value: String(msgs.c) },
        { label: 'Conversations', value: String(convos.c) },
        { label: 'XP', value: xp.toLocaleString() },
      ]
    }
    if (dbName === 'crm') {
      const { getDb } = require('../lib/db')
      const db = getDb('crm')
      const accounts = db.prepare('SELECT COUNT(*) as c FROM accounts').get() as { c: number }
      const contacts = db.prepare('SELECT COUNT(*) as c FROM contacts').get() as { c: number }
      const deals = db.prepare('SELECT COUNT(*) as c FROM deals').get() as { c: number }
      return [
        { label: 'Accounts', value: String(accounts.c) },
        { label: 'Contacts', value: String(contacts.c) },
        { label: 'Deals', value: String(deals.c) },
      ]
    }
  } catch {
    // Silently fail
  }
  return []
}

const DB_INFO = [
  { name: 'index' as const, label: 'Content Index', description: 'Content, assets, daily logs, blog generations' },
  { name: 'niobot' as const, label: 'NioBot', description: 'Conversations, messages, evolution, memory' },
  { name: 'crm' as const, label: 'CRM', description: 'Accounts, contacts, deals, activities' },
]

export default function DatabasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">DATABASES</h1>
        <p className="text-sm text-gray-500">Live SQLite database explorer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DB_INFO.map((info) => {
          let tables: { name: string; count: number }[] = []
          let fileSize = 0
          let totalRows = 0
          let metrics: { label: string; value: string }[] = []

          try {
            tables = getTableList(info.name)
            fileSize = getDbFileSize(info.name)
            totalRows = tables.reduce((s, t) => s + t.count, 0)
            metrics = getKeyMetrics(info.name)
          } catch {
            // DB might not exist yet
          }

          return (
            <Link key={info.name} href={`/databases/${info.name}/`} className="block group">
              <div className="card hover:bg-gray-800 transition-colors h-full">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-bold text-green-300">{info.label}</h2>
                </div>
                <p className="text-xs text-gray-500 mb-4">{info.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{tables.length}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Tables</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{totalRows.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Rows</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">{formatBytes(fileSize)}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Size</div>
                  </div>
                </div>

                {metrics.length > 0 && (
                  <div className="border-t border-green-800/50 pt-3 space-y-1">
                    {metrics.map((m) => (
                      <div key={m.label} className="flex justify-between text-xs">
                        <span className="text-gray-500">{m.label}</span>
                        <span className="text-green-400 font-medium">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-600">
                  <HardDrive className="w-3 h-3" />
                  <span className="truncate">{getDbPath(info.name)}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
