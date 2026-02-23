// NioBot V2 — SQLite connection singleton
// Data lives at ~/.niobot/data/niobot.db (outside repo)

import Database from 'better-sqlite3'
import path from 'path'
import os from 'os'
import { mkdirSync } from 'fs'

const DATA_DIR = path.join(os.homedir(), '.niobot', 'data')
const DB_PATH = path.join(DATA_DIR, 'niobot.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db

  mkdirSync(DATA_DIR, { recursive: true })

  _db = new Database(DB_PATH)

  // Performance pragmas
  _db.pragma('journal_mode = WAL')
  _db.pragma('synchronous = NORMAL')
  _db.pragma('foreign_keys = ON')
  _db.pragma('busy_timeout = 5000')

  return _db
}

export function getDataDir(): string {
  return DATA_DIR
}

export function getDbPath(): string {
  return DB_PATH
}
