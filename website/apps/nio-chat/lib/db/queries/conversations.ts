// NioBot V2 — Conversation & message CRUD + FTS5 search

import { getDb } from '../../db'
import { ensureMigrated } from '../migrate'

export interface ConversationRow {
  id: string
  session_id: string | null
  agent_id: string
  title: string | null
  model: string | null
  created_at: number
  updated_at: number
  total_input_tokens: number
  total_output_tokens: number
  total_cost_cents: number
  turn_count: number
  archived: number
}

export interface MessageRow {
  id: string
  conversation_id: string
  role: string
  content: string
  agent_id: string | null
  model: string | null
  input_tokens: number | null
  output_tokens: number | null
  cost_cents: number | null
  created_at: number
}

function db() {
  ensureMigrated()
  return getDb()
}

// --- Conversations ---

export function createConversation(params: {
  id: string
  sessionId?: string
  agentId: string
  title?: string
  model?: string
}): ConversationRow {
  const now = Date.now()
  db().prepare(`
    INSERT INTO conversations (id, session_id, agent_id, title, model, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(params.id, params.sessionId ?? null, params.agentId, params.title ?? null, params.model ?? null, now, now)

  return getConversation(params.id)!
}

export function getConversation(id: string): ConversationRow | null {
  return db().prepare('SELECT * FROM conversations WHERE id = ?').get(id) as ConversationRow | null
}

export function getConversationBySession(sessionId: string): ConversationRow | null {
  return db().prepare('SELECT * FROM conversations WHERE session_id = ?').get(sessionId) as ConversationRow | null
}

export function listConversations(params?: {
  agentId?: string
  limit?: number
  offset?: number
  archived?: boolean
}): ConversationRow[] {
  const conditions: string[] = []
  const values: unknown[] = []

  if (params?.agentId) {
    conditions.push('agent_id = ?')
    values.push(params.agentId)
  }

  conditions.push('archived = ?')
  values.push(params?.archived ? 1 : 0)

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const limit = params?.limit ?? 50
  const offset = params?.offset ?? 0

  return db().prepare(`
    SELECT * FROM conversations ${where}
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
  `).all(...values, limit, offset) as ConversationRow[]
}

export function updateConversation(id: string, updates: {
  title?: string
  sessionId?: string
  model?: string
  totalInputTokens?: number
  totalOutputTokens?: number
  totalCostCents?: number
  turnCount?: number
  archived?: boolean
}): void {
  const sets: string[] = ['updated_at = ?']
  const values: unknown[] = [Date.now()]

  if (updates.title !== undefined) { sets.push('title = ?'); values.push(updates.title) }
  if (updates.sessionId !== undefined) { sets.push('session_id = ?'); values.push(updates.sessionId) }
  if (updates.model !== undefined) { sets.push('model = ?'); values.push(updates.model) }
  if (updates.totalInputTokens !== undefined) { sets.push('total_input_tokens = ?'); values.push(updates.totalInputTokens) }
  if (updates.totalOutputTokens !== undefined) { sets.push('total_output_tokens = ?'); values.push(updates.totalOutputTokens) }
  if (updates.totalCostCents !== undefined) { sets.push('total_cost_cents = ?'); values.push(updates.totalCostCents) }
  if (updates.turnCount !== undefined) { sets.push('turn_count = ?'); values.push(updates.turnCount) }
  if (updates.archived !== undefined) { sets.push('archived = ?'); values.push(updates.archived ? 1 : 0) }

  values.push(id)
  db().prepare(`UPDATE conversations SET ${sets.join(', ')} WHERE id = ?`).run(...values)
}

export function deleteConversation(id: string): void {
  db().prepare('DELETE FROM conversations WHERE id = ?').run(id)
}

// --- Messages ---

export function insertMessage(params: {
  id: string
  conversationId: string
  role: string
  content: string
  agentId?: string
  model?: string
  inputTokens?: number
  outputTokens?: number
  costCents?: number
}): void {
  db().prepare(`
    INSERT INTO messages (id, conversation_id, role, content, agent_id, model, input_tokens, output_tokens, cost_cents, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    params.id,
    params.conversationId,
    params.role,
    params.content,
    params.agentId ?? null,
    params.model ?? null,
    params.inputTokens ?? null,
    params.outputTokens ?? null,
    params.costCents ?? null,
    Date.now()
  )
}

export function getMessages(conversationId: string): MessageRow[] {
  return db().prepare(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
  ).all(conversationId) as MessageRow[]
}

// --- FTS5 Search ---

export function searchMessages(query: string, limit = 20): (MessageRow & { rank: number })[] {
  ensureMigrated()
  return getDb().prepare(`
    SELECT m.*, messages_fts.rank
    FROM messages_fts
    JOIN messages m ON m.rowid = messages_fts.rowid
    WHERE messages_fts MATCH ?
    ORDER BY messages_fts.rank
    LIMIT ?
  `).all(query, limit) as (MessageRow & { rank: number })[]
}

// --- Daily Costs ---

export function upsertDailyCost(params: {
  agentId: string
  model: string
  inputTokens: number
  outputTokens: number
  costCents: number
}): void {
  const date = new Date().toISOString().split('T')[0]
  db().prepare(`
    INSERT INTO daily_costs (date, agent_id, model, input_tokens, output_tokens, cost_cents, request_count)
    VALUES (?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(date, agent_id, model) DO UPDATE SET
      input_tokens = input_tokens + excluded.input_tokens,
      output_tokens = output_tokens + excluded.output_tokens,
      cost_cents = cost_cents + excluded.cost_cents,
      request_count = request_count + 1
  `).run(date, params.agentId, params.model, params.inputTokens, params.outputTokens, params.costCents)
}

export function getDailyCost(date?: string): { total_cost_cents: number } {
  const d = date ?? new Date().toISOString().split('T')[0]
  const row = db().prepare('SELECT COALESCE(SUM(cost_cents), 0) as total_cost_cents FROM daily_costs WHERE date = ?').get(d) as { total_cost_cents: number }
  return row
}
