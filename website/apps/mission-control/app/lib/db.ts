import Database from 'better-sqlite3'
import path from 'path'
import os from 'os'

// Database paths
const DB_PATHS = {
  index: path.join(process.cwd(), '..', '..', '..', 'data', 'index.db'),
  niobot: path.join(os.homedir(), '.niobot', 'data', 'niobot.db'),
  crm: path.join(process.cwd(), '..', '..', '..', 'data', 'crm.db'),
} as const

type DbName = keyof typeof DB_PATHS

// Singleton cache
const connections = new Map<string, Database.Database>()

export function getDb(name: DbName): Database.Database {
  const cached = connections.get(name)
  if (cached) return cached

  const dbPath = DB_PATHS[name]
  const readonly = name !== 'crm'

  const db = new Database(dbPath, { readonly })
  if (!readonly) {
    db.pragma('journal_mode = WAL')
  }
  db.pragma('foreign_keys = ON')

  connections.set(name, db)
  return db
}

/** Validate that a table name exists in the database (prevents SQL injection) */
function validateTable(db: Database.Database, tableName: string): void {
  const exists = db.prepare(
    `SELECT 1 FROM sqlite_master WHERE type='table' AND name = ?`
  ).get(tableName)
  if (!exists) throw new Error('Invalid table name')
}

/** Get valid column names for a table (table must be validated first) */
function getValidColumns(db: Database.Database, tableName: string): string[] {
  const pragma = db.prepare(`PRAGMA table_info("${tableName}")`).all() as { name: string }[]
  return pragma.map((p) => p.name)
}

export function getTableList(dbName: DbName): { name: string; count: number }[] {
  const db = getDb(dbName)
  const tables = db.prepare(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`
  ).all() as { name: string }[]

  return tables.map((t) => {
    try {
      const row = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get() as { count: number }
      return { name: t.name, count: row.count }
    } catch {
      return { name: t.name, count: 0 }
    }
  })
}

export function getTableSchema(dbName: DbName, tableName: string): string {
  const db = getDb(dbName)
  const row = db.prepare(
    `SELECT sql FROM sqlite_master WHERE type='table' AND name = ?`
  ).get(tableName) as { sql: string } | undefined
  return row?.sql ?? ''
}

export function queryTable(
  dbName: DbName,
  tableName: string,
  opts: { limit?: number; offset?: number; search?: string; searchColumn?: string } = {}
): { rows: Record<string, unknown>[]; total: number; columns: string[] } {
  const db = getDb(dbName)
  const limit = opts.limit ?? 50
  const offset = opts.offset ?? 0

  // Validate tableName exists in the database (parameterized — safe from injection)
  validateTable(db, tableName)

  // Get valid columns (tableName already validated above)
  const columns = getValidColumns(db, tableName)

  // Validate searchColumn if provided
  if (opts.searchColumn && !columns.includes(opts.searchColumn)) {
    throw new Error('Invalid search column')
  }

  // Count
  let countSql = `SELECT COUNT(*) as total FROM "${tableName}"`
  const countParams: unknown[] = []

  if (opts.search && opts.searchColumn) {
    countSql += ` WHERE "${opts.searchColumn}" LIKE ?`
    countParams.push(`%${opts.search}%`)
  }

  const totalRow = db.prepare(countSql).get(...countParams) as { total: number }

  // Query
  let querySql = `SELECT * FROM "${tableName}"`
  const queryParams: unknown[] = []

  if (opts.search && opts.searchColumn) {
    querySql += ` WHERE "${opts.searchColumn}" LIKE ?`
    queryParams.push(`%${opts.search}%`)
  }

  querySql += ` LIMIT ? OFFSET ?`
  queryParams.push(limit, offset)

  const rows = db.prepare(querySql).all(...queryParams) as Record<string, unknown>[]

  return { rows, total: totalRow.total, columns }
}

export function getDbFileSize(name: DbName): number {
  try {
    const fs = require('fs')
    const stats = fs.statSync(DB_PATHS[name])
    return stats.size
  } catch {
    return 0
  }
}

export function getDbPath(name: DbName): string {
  return DB_PATHS[name]
}
