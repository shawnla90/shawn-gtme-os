// NioBot V3 — DNA: Unified persistence layer (server-authoritative)
// All synchronous (better-sqlite3). Prepared statements for performance.

import { getDb } from '../../db'
import { ensureMigrated } from '../migrate'
import {
  getLevelProgress,
  getStreakMultiplier,
  calculateStreak,
  getToday,
  getSkillProgress,
  SKILLS,
  type LevelProgress,
} from '../../evolution'

// ============================================================
// Types
// ============================================================

export interface DNAState {
  userId: string
  xp: number
  tier: number
  level: number
  streak: number
  lastActiveDate: string | null
  dailyBonusClaimed: boolean
  skillXP: Record<string, number>
  activeSoulTraits: string[]
  personalityFlags: Record<string, unknown>
  totalMessages: number
  totalConversations: number
  totalCostCents: number
  createdAt: number
  updatedAt: number
}

export interface DNASnapshot extends DNAState {
  xpLast24h: number
  memoryCount: number
  conversationsToday: number
  costTodayCents: number
}

export interface XPAwardResult {
  xpAwarded: number
  newXP: number
  multiplier: number
  tier: number
  level: number
  tierName: string
  leveledUp: boolean
  tieredUp: boolean
  totalLevel: number
}

export interface StreakResult {
  streak: number
  isNewDay: boolean
  dailyBonusAvailable: boolean
}

export interface MemoryRow {
  id: string
  agentId: string
  type: string
  content: string
  source: string | null
  tags: string[]
  importance: number
  conversationId: string | null
  extracted: boolean
  accessCount: number
  lastAccessedAt: number | null
  createdAt: number
  expiresAt: number | null
}

export interface XPHistoryRow {
  id: number
  xpGained: number
  source: string
  skillId: string | null
  multiplier: number
  conversationId: string | null
  agentId: string | null
  details: Record<string, unknown>
  createdAt: string | number
}

export interface XPDailySummary {
  day: string
  totalXP: number
  eventCount: number
  sources: string
}

// ============================================================
// Helpers
// ============================================================

function db() {
  ensureMigrated()
  return getDb()
}

function parseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) } catch { return fallback }
}

function computeTierLevel(xp: number): { tier: number; level: number } {
  const progress = getLevelProgress(xp)
  return { tier: progress.tier, level: progress.level }
}

// ============================================================
// DNA State Reads
// ============================================================

/** Full snapshot via v_dna_snapshot view (client hydration) */
export function getDNASnapshot(userId = 'default'): DNASnapshot | null {
  const row = db().prepare('SELECT * FROM v_dna_snapshot WHERE user_id = ?').get(userId) as Record<string, unknown> | undefined
  if (!row) return null

  return {
    userId: row.user_id as string,
    xp: row.xp as number,
    tier: row.tier as number,
    level: row.level as number,
    streak: row.streak as number,
    lastActiveDate: row.last_active_date as string | null,
    dailyBonusClaimed: !!(row.daily_bonus_claimed as number),
    skillXP: parseJSON(row.skill_xp as string, {}),
    activeSoulTraits: parseJSON(row.active_soul_traits as string, []),
    personalityFlags: parseJSON(row.personality_flags as string, {}),
    totalMessages: row.total_messages as number,
    totalConversations: row.total_conversations as number,
    totalCostCents: row.total_cost_cents as number,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
    xpLast24h: row.xp_last_24h as number,
    memoryCount: row.memory_count as number,
    conversationsToday: row.conversations_today as number,
    costTodayCents: row.cost_today_cents as number,
  }
}

/** Lightweight read: just xp/tier/level/streak/skillXP (hot path) */
export function getDNAState(userId = 'default'): DNAState | null {
  const row = db().prepare(
    'SELECT * FROM dna_state WHERE user_id = ?'
  ).get(userId) as Record<string, unknown> | undefined
  if (!row) return null

  return {
    userId: row.user_id as string,
    xp: row.xp as number,
    tier: row.tier as number,
    level: row.level as number,
    streak: row.streak as number,
    lastActiveDate: row.last_active_date as string | null,
    dailyBonusClaimed: !!(row.daily_bonus_claimed as number),
    skillXP: parseJSON(row.skill_xp as string, {}),
    activeSoulTraits: parseJSON(row.active_soul_traits as string, []),
    personalityFlags: parseJSON(row.personality_flags as string, {}),
    totalMessages: row.total_messages as number,
    totalConversations: row.total_conversations as number,
    totalCostCents: row.total_cost_cents as number,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  }
}

// ============================================================
// XP System (server-authoritative)
// ============================================================

/** Award XP — transaction: validate, apply multiplier, update state, write audit */
export function awardXP(params: {
  amount: number
  source: string
  skillId?: string
  agentId?: string
  conversationId?: string
  userId?: string
}): XPAwardResult {
  const { amount, source, skillId, agentId, conversationId, userId = 'default' } = params
  const d = db()

  return d.transaction(() => {
    // 1. Read current state
    const state = getDNAState(userId)
    if (!state) throw new Error('DNA state not found')

    // 2. Apply streak multiplier server-side
    const multiplier = getStreakMultiplier(state.streak)
    const xpAwarded = Math.round(amount * multiplier)

    // 3. Calculate new tier/level
    const newXP = state.xp + xpAwarded
    const beforeProgress = getLevelProgress(state.xp)
    const afterProgress = getLevelProgress(newXP)

    // 4. Update skill XP
    const skillXP = { ...state.skillXP }
    if (skillId) {
      skillXP[skillId] = (skillXP[skillId] || 0) + xpAwarded
    }

    // 5. Update dna_state
    d.prepare(`
      UPDATE dna_state SET
        xp = ?, tier = ?, level = ?,
        skill_xp = ?,
        updated_at = ?
      WHERE user_id = ?
    `).run(
      newXP,
      afterProgress.tier,
      afterProgress.level,
      JSON.stringify(skillXP),
      Date.now(),
      userId
    )

    // 6. Write evolution_history audit row
    d.prepare(`
      INSERT INTO evolution_history (user_id, xp_gained, source, skill_id, multiplier, created_at, conversation_id, agent_id, details)
      VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
    `).run(
      userId, xpAwarded, source, skillId ?? null, multiplier,
      conversationId ?? null, agentId ?? null,
      JSON.stringify({ baseAmount: amount, finalAmount: xpAwarded })
    )

    // 7. Sync to legacy evolution + evolution_skills tables
    d.prepare(`
      INSERT INTO evolution (user_id, xp, streak, last_active_date, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        xp = excluded.xp,
        streak = excluded.streak,
        updated_at = datetime('now')
    `).run(userId, newXP, state.streak, state.lastActiveDate)

    if (skillId) {
      d.prepare(`
        INSERT INTO evolution_skills (user_id, skill_id, xp)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, skill_id) DO UPDATE SET
          xp = excluded.xp
      `).run(userId, skillId, skillXP[skillId])
    }

    return {
      xpAwarded,
      newXP,
      multiplier,
      tier: afterProgress.tier,
      level: afterProgress.level,
      tierName: afterProgress.tierName,
      leveledUp: afterProgress.totalLevel > beforeProgress.totalLevel,
      tieredUp: afterProgress.tier > beforeProgress.tier,
      totalLevel: afterProgress.totalLevel,
    }
  })()
}

// ============================================================
// Streak Management
// ============================================================

/** Called on GET /api/dna — handles new-day logic */
export function updateStreak(userId = 'default'): StreakResult {
  const d = db()

  return d.transaction(() => {
    const state = getDNAState(userId)
    if (!state) throw new Error('DNA state not found')

    const today = getToday()
    const streakDelta = calculateStreak(state.lastActiveDate, today)
    let isNewDay = false
    let streak = state.streak

    if (streakDelta === -1) {
      // Same day — no change
    } else if (streakDelta === 1) {
      // Consecutive day
      streak += 1
      isNewDay = true
    } else {
      // Streak broken or first day
      streak = state.lastActiveDate ? 1 : 0
      isNewDay = state.lastActiveDate !== null
    }

    if (isNewDay || state.lastActiveDate !== today) {
      d.prepare(`
        UPDATE dna_state SET
          streak = ?,
          last_active_date = ?,
          daily_bonus_claimed = 0,
          updated_at = ?
        WHERE user_id = ?
      `).run(streak, today, Date.now(), userId)

      // Sync legacy
      d.prepare(`
        UPDATE evolution SET streak = ?, last_active_date = ?, updated_at = datetime('now')
        WHERE user_id = ?
      `).run(streak, today, userId)
    }

    const dailyBonusAvailable = !checkDailyFlag('daily_bonus', userId)

    return { streak, isNewDay, dailyBonusAvailable }
  })()
}

/** Atomic check-and-claim via dna_daily_flags */
export function claimDailyBonus(userId = 'default'): { claimed: boolean; xpResult?: XPAwardResult } {
  const d = db()

  return d.transaction(() => {
    const today = getToday()

    // Check if already claimed
    const existing = d.prepare(
      'SELECT 1 FROM dna_daily_flags WHERE user_id = ? AND date = ? AND flag = ?'
    ).get(userId, today, 'daily_bonus')

    if (existing) return { claimed: false }

    // Claim it
    d.prepare(
      'INSERT INTO dna_daily_flags (user_id, date, flag) VALUES (?, ?, ?)'
    ).run(userId, today, 'daily_bonus')

    d.prepare(
      'UPDATE dna_state SET daily_bonus_claimed = 1, updated_at = ? WHERE user_id = ?'
    ).run(Date.now(), userId)

    return { claimed: true }
  })()
}

/** Check if a daily flag is set for today */
export function checkDailyFlag(flag: string, userId = 'default'): boolean {
  const today = getToday()
  const row = db().prepare(
    'SELECT 1 FROM dna_daily_flags WHERE user_id = ? AND date = ? AND flag = ?'
  ).get(userId, today, flag)
  return !!row
}

/** Set a daily flag for today */
export function setDailyFlag(flag: string, userId = 'default'): void {
  const today = getToday()
  db().prepare(
    'INSERT OR IGNORE INTO dna_daily_flags (user_id, date, flag) VALUES (?, ?, ?)'
  ).run(userId, today, flag)
}

// ============================================================
// Memory CRUD + Search
// ============================================================

export function insertMemory(params: {
  id: string
  agentId: string
  type: string
  content: string
  tags?: string[]
  importance?: number
  conversationId?: string
  ttlMs?: number
  source?: string
  extracted?: boolean
}): void {
  const now = Date.now()
  const expiresAt = params.ttlMs ? now + params.ttlMs : null

  db().prepare(`
    INSERT INTO memory (id, agent_id, type, content, source, ttl_ms, created_at, expires_at, tags, importance, conversation_id, extracted)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    params.id,
    params.agentId,
    params.type,
    params.content,
    params.source ?? null,
    params.ttlMs ?? null,
    now,
    expiresAt,
    JSON.stringify(params.tags ?? []),
    params.importance ?? 0.5,
    params.conversationId ?? null,
    params.extracted ? 1 : 0,
  )
}

export function getMemories(params?: {
  agentId?: string
  type?: string
  limit?: number
  minImportance?: number
}): MemoryRow[] {
  const conditions: string[] = ['(expires_at IS NULL OR expires_at > ?)']
  const values: unknown[] = [Date.now()]

  if (params?.agentId) {
    conditions.push('agent_id = ?')
    values.push(params.agentId)
  }
  if (params?.type) {
    conditions.push('type = ?')
    values.push(params.type)
  }
  if (params?.minImportance != null) {
    conditions.push('importance >= ?')
    values.push(params.minImportance)
  }

  const limit = params?.limit ?? 50
  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = db().prepare(`
    SELECT * FROM memory ${where}
    ORDER BY importance DESC, created_at DESC
    LIMIT ?
  `).all(...values, limit) as Record<string, unknown>[]

  return rows.map(mapMemoryRow)
}

/** FTS5 search with expiration filtering */
export function searchMemory(query: string, limit = 20): MemoryRow[] {
  const rows = db().prepare(`
    SELECT m.*, memory_fts.rank
    FROM memory_fts
    JOIN memory m ON m.rowid = memory_fts.rowid
    WHERE memory_fts MATCH ?
      AND (m.expires_at IS NULL OR m.expires_at > ?)
    ORDER BY memory_fts.rank
    LIMIT ?
  `).all(query, Date.now(), limit) as Record<string, unknown>[]

  return rows.map(mapMemoryRow)
}

/** Increment access_count, update last_accessed_at */
export function touchMemory(id: string): void {
  db().prepare(`
    UPDATE memory SET
      access_count = access_count + 1,
      last_accessed_at = ?
    WHERE id = ?
  `).run(Date.now(), id)
}

/** Cleanup expired memories */
export function deleteExpiredMemories(): number {
  const result = db().prepare(
    'DELETE FROM memory WHERE expires_at IS NOT NULL AND expires_at <= ?'
  ).run(Date.now())
  return result.changes
}

function mapMemoryRow(row: Record<string, unknown>): MemoryRow {
  return {
    id: row.id as string,
    agentId: row.agent_id as string,
    type: row.type as string,
    content: row.content as string,
    source: row.source as string | null,
    tags: parseJSON(row.tags as string, []),
    importance: (row.importance as number) ?? 0.5,
    conversationId: row.conversation_id as string | null,
    extracted: !!(row.extracted as number),
    accessCount: (row.access_count as number) ?? 0,
    lastAccessedAt: row.last_accessed_at as number | null,
    createdAt: row.created_at as number,
    expiresAt: row.expires_at as number | null,
  }
}

// ============================================================
// Chat Persistence Helpers
// ============================================================

/** Record a chat turn: update dna_state counters + conversation totals */
export function recordChatTurn(params: {
  conversationId: string
  agentId: string
  model: string
  inputTokens: number
  outputTokens: number
  costCents: number
  userId?: string
}): void {
  const { conversationId, agentId, model, inputTokens, outputTokens, costCents, userId = 'default' } = params
  const d = db()

  d.transaction(() => {
    // Update dna_state counters
    d.prepare(`
      UPDATE dna_state SET
        total_messages = total_messages + 1,
        total_cost_cents = total_cost_cents + ?,
        updated_at = ?
      WHERE user_id = ?
    `).run(costCents, Date.now(), userId)

    // Update conversation totals
    d.prepare(`
      UPDATE conversations SET
        total_input_tokens = total_input_tokens + ?,
        total_output_tokens = total_output_tokens + ?,
        total_cost_cents = total_cost_cents + ?,
        turn_count = turn_count + 1,
        model = ?,
        updated_at = ?
      WHERE id = ?
    `).run(inputTokens, outputTokens, costCents, model, Date.now(), conversationId)
  })()
}

// ============================================================
// XP History
// ============================================================

/** Audit trail */
export function getXPHistory(params?: {
  limit?: number
  agentId?: string
  since?: number
  userId?: string
}): XPHistoryRow[] {
  const conditions: string[] = ['user_id = ?']
  const values: unknown[] = [params?.userId ?? 'default']

  if (params?.agentId) {
    conditions.push('agent_id = ?')
    values.push(params.agentId)
  }
  if (params?.since) {
    // Handle both datetime and epoch formats
    conditions.push(`(
      CASE WHEN typeof(created_at) = 'text'
        THEN CAST(strftime('%s', created_at) AS INTEGER) * 1000
        ELSE created_at
      END
    ) >= ?`)
    values.push(params.since)
  }

  const limit = params?.limit ?? 50
  const where = `WHERE ${conditions.join(' AND ')}`

  const rows = db().prepare(`
    SELECT * FROM evolution_history ${where}
    ORDER BY id DESC
    LIMIT ?
  `).all(...values, limit) as Record<string, unknown>[]

  return rows.map(row => ({
    id: row.id as number,
    xpGained: row.xp_gained as number,
    source: row.source as string,
    skillId: row.skill_id as string | null,
    multiplier: row.multiplier as number,
    conversationId: row.conversation_id as string | null,
    agentId: row.agent_id as string | null,
    details: parseJSON(row.details as string, {}),
    createdAt: row.created_at as string | number,
  }))
}

/** XP trend data via v_xp_daily_summary view */
export function getXPDailySummary(days = 30): XPDailySummary[] {
  const rows = db().prepare(`
    SELECT * FROM v_xp_daily_summary LIMIT ?
  `).all(days) as Record<string, unknown>[]

  return rows.map(row => ({
    day: row.day as string,
    totalXP: row.total_xp as number,
    eventCount: row.event_count as number,
    sources: row.sources as string,
  }))
}

// ============================================================
// Bootstrap (localStorage migration)
// ============================================================

/** One-time migration from localStorage. Only writes if dna_state.xp == 0. */
export function bootstrapFromLocalStorage(clientState: {
  xp: number
  skillXP: Record<string, number>
  streak: number
  lastActiveDate: string | null
}, userId = 'default'): boolean {
  const d = db()

  return d.transaction(() => {
    const current = getDNAState(userId)
    if (!current || current.xp > 0) return false

    const { tier, level } = computeTierLevel(clientState.xp)

    d.prepare(`
      UPDATE dna_state SET
        xp = ?, tier = ?, level = ?,
        streak = ?,
        last_active_date = ?,
        skill_xp = ?,
        updated_at = ?
      WHERE user_id = ?
    `).run(
      clientState.xp,
      tier,
      level,
      clientState.streak,
      clientState.lastActiveDate,
      JSON.stringify(clientState.skillXP),
      Date.now(),
      userId,
    )

    // Sync to legacy tables
    d.prepare(`
      INSERT INTO evolution (user_id, xp, streak, last_active_date, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(user_id) DO UPDATE SET
        xp = excluded.xp,
        streak = excluded.streak,
        last_active_date = excluded.last_active_date,
        updated_at = datetime('now')
    `).run(userId, clientState.xp, clientState.streak, clientState.lastActiveDate)

    for (const [skillId, xp] of Object.entries(clientState.skillXP)) {
      d.prepare(`
        INSERT INTO evolution_skills (user_id, skill_id, xp)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, skill_id) DO UPDATE SET
          xp = excluded.xp
      `).run(userId, skillId, xp)
    }

    return true
  })()
}

// ============================================================
// Computed helpers (for API enrichment)
// ============================================================

export function enrichSnapshot(snapshot: DNASnapshot): Record<string, unknown> {
  const progress = getLevelProgress(snapshot.xp)
  const multiplier = getStreakMultiplier(snapshot.streak)

  const skillProgress: Record<string, unknown> = {}
  for (const skill of SKILLS) {
    const xp = snapshot.skillXP[skill.id] ?? 0
    skillProgress[skill.id] = getSkillProgress(skill.id, xp)
  }

  return {
    ...snapshot,
    levelProgress: progress.levelProgress,
    xpForNextLevel: progress.xpForNextLevel,
    xpForCurrentLevel: progress.xpForCurrentLevel,
    totalLevel: progress.totalLevel,
    tierName: progress.tierName,
    isMaxTier: progress.isMaxTier,
    isMaxLevel: progress.isMaxLevel,
    streakMultiplier: multiplier,
    skillProgress,
  }
}
