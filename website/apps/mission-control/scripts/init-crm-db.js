#!/usr/bin/env node
/**
 * Initialize the CRM database with schema.
 * Run: node scripts/init-crm-db.js
 */
const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, '..', '..', '..', '..', 'data', 'crm.db')
console.log(`Initializing CRM database at: ${DB_PATH}`)

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    domain TEXT,
    industry TEXT,
    size TEXT,
    geography TEXT,
    source TEXT,
    stage TEXT NOT NULL DEFAULT 'prospect' CHECK(stage IN ('prospect', 'qualified', 'opportunity', 'customer', 'churned')),
    tags TEXT DEFAULT '[]',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT,
    persona TEXT,
    is_primary INTEGER DEFAULT 0,
    linkedin_url TEXT,
    source TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_contacts_account ON contacts(account_id);
  CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

  CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    value_cents INTEGER DEFAULT 0,
    stage TEXT NOT NULL DEFAULT 'discovery' CHECK(stage IN ('discovery', 'demo', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    probability INTEGER DEFAULT 0,
    expected_close_date TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_deals_account ON deals(account_id);
  CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);

  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
    deal_id INTEGER REFERENCES deals(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK(type IN ('email', 'call', 'meeting', 'note', 'task', 'import')),
    title TEXT NOT NULL,
    body TEXT,
    metadata TEXT DEFAULT '{}',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_activities_account ON activities(account_id);
  CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);

  CREATE TABLE IF NOT EXISTS landing_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    url TEXT,
    template TEXT,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'live', 'archived')),
    views INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_landing_pages_account ON landing_pages(account_id);
`)

console.log('CRM database initialized successfully!')
console.log('Tables created: accounts, contacts, deals, activities, landing_pages')

db.close()
