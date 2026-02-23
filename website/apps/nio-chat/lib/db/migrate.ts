// NioBot V2 — Simple SQL migration runner
// Reads .sql files from lib/db/migrations/, applies in order, tracks in schema_migrations table.

import { getDb } from '../db'
import { readdirSync, readFileSync, existsSync } from 'fs'
import path from 'path'

// Resolve migrations dir relative to project root (works with Next.js bundling)
function getMigrationsDir(): string {
  // Try common locations
  const candidates = [
    path.join(process.cwd(), 'lib', 'db', 'migrations'),
    path.join(__dirname, 'migrations'),
  ]
  for (const dir of candidates) {
    if (existsSync(dir)) return dir
  }
  return candidates[0]
}

export function runMigrations(): void {
  const db = getDb()

  // Ensure schema_migrations table exists (bootstrap)
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
    )
  `)

  // Get already-applied versions
  const applied = new Set(
    db.prepare('SELECT version FROM schema_migrations').all()
      .map((row) => (row as { version: number }).version)
  )

  // Read migration files, sorted by version number
  const migrationsDir = getMigrationsDir()
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    const match = file.match(/^(\d+)/)
    if (!match) continue

    const version = parseInt(match[1], 10)
    if (applied.has(version)) continue

    const sql = readFileSync(path.join(migrationsDir, file), 'utf-8')

    db.transaction(() => {
      db.exec(sql)
      db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(version)
    })()

    console.log(`[migrate] applied: ${file}`)
  }
}

// Auto-run when imported server-side
let _migrated = false
export function ensureMigrated(): void {
  if (_migrated) return
  _migrated = true
  runMigrations()
}
