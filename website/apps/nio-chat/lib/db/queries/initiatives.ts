// NioBot V3 — Initiative CRUD + view queries

import { getDb } from '../../db'
import { ensureMigrated } from '../migrate'

// --- Types ---

export type InitiativeStatus = 'idea' | 'planned' | 'in_progress' | 'blocked' | 'completed' | 'dropped'
export type InitiativeSource = 'manual' | 'evaluate' | 'discuss' | 'phase_report' | 'morning'
export type InitiativePillar = 'messaging' | 'chimes' | 'evolution' | 'ops' | 'content' | 'infra'

export interface InitiativeRow {
  id: number
  title: string
  description: string | null
  status: InitiativeStatus
  source: InitiativeSource
  source_url: string | null
  pillar: InitiativePillar | null
  priority: number
  depends_on: string           // JSON string — use parseDependsOn()
  blocked_by: string | null
  notes: string | null
  created_at: number
  updated_at: number
}

export interface InitiativeParsed extends Omit<InitiativeRow, 'depends_on'> {
  depends_on: number[]
}

// --- Helpers ---

function db() {
  ensureMigrated()
  return getDb()
}

function parseRow(row: InitiativeRow): InitiativeParsed {
  return {
    ...row,
    depends_on: JSON.parse(row.depends_on) as number[],
  }
}

// --- CRUD ---

export function createInitiative(params: {
  title: string
  description?: string
  status?: InitiativeStatus
  source?: InitiativeSource
  sourceUrl?: string
  pillar?: InitiativePillar
  priority?: number
  dependsOn?: number[]
  blockedBy?: string
  notes?: string
}): InitiativeParsed {
  const now = Date.now()
  const result = db().prepare(`
    INSERT INTO initiatives (title, description, status, source, source_url, pillar, priority, depends_on, blocked_by, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    params.title,
    params.description ?? null,
    params.status ?? 'idea',
    params.source ?? 'manual',
    params.sourceUrl ?? null,
    params.pillar ?? null,
    params.priority ?? 3,
    JSON.stringify(params.dependsOn ?? []),
    params.blockedBy ?? null,
    params.notes ?? null,
    now,
    now
  )

  return getInitiative(Number(result.lastInsertRowid))!
}

export function getInitiative(id: number): InitiativeParsed | null {
  const row = db().prepare('SELECT * FROM initiatives WHERE id = ?').get(id) as InitiativeRow | null
  return row ? parseRow(row) : null
}

export function updateInitiative(id: number, updates: {
  title?: string
  description?: string
  status?: InitiativeStatus
  source?: InitiativeSource
  sourceUrl?: string
  pillar?: InitiativePillar | null
  priority?: number
  dependsOn?: number[]
  blockedBy?: string | null
  notes?: string | null
}): void {
  const sets: string[] = []
  const values: unknown[] = []

  if (updates.title !== undefined) { sets.push('title = ?'); values.push(updates.title) }
  if (updates.description !== undefined) { sets.push('description = ?'); values.push(updates.description) }
  if (updates.status !== undefined) { sets.push('status = ?'); values.push(updates.status) }
  if (updates.source !== undefined) { sets.push('source = ?'); values.push(updates.source) }
  if (updates.sourceUrl !== undefined) { sets.push('source_url = ?'); values.push(updates.sourceUrl) }
  if (updates.pillar !== undefined) { sets.push('pillar = ?'); values.push(updates.pillar) }
  if (updates.priority !== undefined) { sets.push('priority = ?'); values.push(updates.priority) }
  if (updates.dependsOn !== undefined) { sets.push('depends_on = ?'); values.push(JSON.stringify(updates.dependsOn)) }
  if (updates.blockedBy !== undefined) { sets.push('blocked_by = ?'); values.push(updates.blockedBy) }
  if (updates.notes !== undefined) { sets.push('notes = ?'); values.push(updates.notes) }

  if (sets.length === 0) return

  values.push(id)
  db().prepare(`UPDATE initiatives SET ${sets.join(', ')} WHERE id = ?`).run(...values)
}

export function listInitiatives(params?: {
  status?: InitiativeStatus
  pillar?: InitiativePillar
  source?: InitiativeSource
  limit?: number
  offset?: number
}): InitiativeParsed[] {
  const conditions: string[] = []
  const values: unknown[] = []

  if (params?.status) {
    conditions.push('status = ?')
    values.push(params.status)
  }
  if (params?.pillar) {
    conditions.push('pillar = ?')
    values.push(params.pillar)
  }
  if (params?.source) {
    conditions.push('source = ?')
    values.push(params.source)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const limit = params?.limit ?? 50
  const offset = params?.offset ?? 0

  const rows = db().prepare(`
    SELECT * FROM initiatives ${where}
    ORDER BY priority DESC, created_at DESC
    LIMIT ? OFFSET ?
  `).all(...values, limit, offset) as InitiativeRow[]

  return rows.map(parseRow)
}

// --- View Queries ---

export function getUnblockedInitiatives(limit = 5): InitiativeParsed[] {
  const rows = db().prepare(`
    SELECT * FROM v_initiatives_unblocked LIMIT ?
  `).all(limit) as InitiativeRow[]

  return rows.map(parseRow)
}

export function getActiveInitiatives(): InitiativeParsed[] {
  const rows = db().prepare(`
    SELECT * FROM v_initiatives_active
  `).all() as InitiativeRow[]

  return rows.map(parseRow)
}
