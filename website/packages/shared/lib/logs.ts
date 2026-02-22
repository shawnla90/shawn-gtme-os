/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

import fs from 'fs'
import path from 'path'

/* ------------------------------------------------------------------ */
/*  Types — matches daily_scan.py v3 JSON schema                      */
/* ------------------------------------------------------------------ */

export interface Accomplishment {
  type: string
  title: string
  source: 'auto' | 'auto-mtime' | 'manual'
  timestamp: string
  words?: number
  // `path` is intentionally omitted from the public type — stripped at read time
}

export interface PipelineDraft {
  platform: string
  title: string
  target_date?: string
  words?: number
  // `path` stripped
}

export interface Pipeline {
  drafts_active: PipelineDraft[]
  finalized_today: PipelineDraft[]
}

export interface Todo {
  id: string
  task: string
  status: 'pending' | 'done'
  priority: 'normal' | 'high'
}

export interface TokenEntry {
  input_tokens: number
  output_tokens: number
  cache_read_tokens: number
  cache_write_tokens: number
  model: string
  source: 'claude-code' | 'cursor-estimate' | 'manual'
  messages?: number
  confidence?: string
  context?: string
  logged_at: string
  cost: number | null
  // `session_id` stripped
}

export interface ScoreBreakdownItem {
  type: string
  title: string
  points: number
}

/* ---- V4 types ---- */

export interface Commit {
  hash: string
  message: string
  type: string
  score: number
  files_changed: number
  lines_added: number
  lines_removed: number
  lines_net: number
  directories: string[]
  timestamp: string
}

export interface DevEquivalent {
  net_lines: number
  dev_days: number
  cost_estimate: number
  explanation: string
  assumptions: {
    lines_per_day: number
    cost_per_day: number
    basis: string
  }
}

export interface CostSection {
  api_equivalent: number
  actual_cost: number
  pricing_mode: string
}

export interface TokenEfficiency {
  total_tokens: number
  total_sessions: number
  tokens_per_point: number | null
  tokens_per_commit: number | null
  tokens_per_loc: number | null
  avg_context_utilization: number
  pricing_mode: string
  api_equivalent_cost: number
  actual_cost: number
}

export interface WeekDaySummary {
  date: string
  commits: number
  score: number
  grade: string
}

export interface PlatformBreakdown {
  [key: string]: number
}

export interface Stats {
  platform_breakdown: PlatformBreakdown
  words_today: number
  pipeline_words: number
  finals_count: number
  first_activity: string
  last_activity: string
  output_score: number
  letter_grade: string
  score_breakdown: ScoreBreakdownItem[]
  efficiency_rating: number | null
  shipped_count?: number
  draft_count?: number
  ship_rate?: number
  agent_cost?: number
  dev_equivalent_cost?: number
  dev_equivalent_breakdown?: {
    code_loc: number
    code_hours: number
    code_cost: number
    content_words: number
    content_hours: number
    content_cost: number
    total: number
  }
  cost_savings?: number
  roi_multiplier?: number
  lines_added?: number
  lines_removed?: number
  lines_net?: number
  code_loc?: number
  content_loc?: number
  data_loc?: number
}

export interface GitSummary {
  commits_today: number
  files_touched?: number
  // `files_added` and `files_modified` stripped — contain full repo paths
}

export interface DailyLog {
  date: string
  generated_at: string
  version: number
  accomplishments: Accomplishment[]
  pipeline: Pipeline
  todos: Todo[]
  token_usage: TokenEntry[]
  stats: Stats
  git_summary: GitSummary
  // V4 fields
  commits?: Commit[]
  dev_equivalent?: DevEquivalent
  cost?: CostSection
  token_efficiency?: TokenEfficiency
}

/** Lightweight summary used on the /log index page. */
export interface DailyLogSummary {
  date: string
  output_score: number
  letter_grade: string
  accomplishment_count: number
  words_today: number
  finals_count: number
  commits_today: number
}

/* ------------------------------------------------------------------ */
/*  Privacy helpers                                                    */
/* ------------------------------------------------------------------ */

/**
 * Strips sensitive fields from the raw JSON before it reaches any component.
 * Removes: path (partner/client folder names), session_id, files_added,
 * files_modified.
 */
function scrubLog(raw: Record<string, unknown>): DailyLog {
  const data = raw as Record<string, any>

  // Scrub accomplishments — drop `path`
  const accomplishments: Accomplishment[] = (data.accomplishments ?? []).map(
    (a: Record<string, any>) => ({
      type: a.type,
      title: a.title,
      source: a.source,
      timestamp: a.timestamp,
      ...(a.words != null ? { words: a.words } : {}),
    }),
  )

  // Scrub pipeline drafts — drop `path`
  const scrubDraft = (d: Record<string, any>): PipelineDraft => ({
    platform: d.platform,
    title: d.title,
    ...(d.target_date != null ? { target_date: d.target_date } : {}),
    ...(d.words != null ? { words: d.words } : {}),
  })

  const pipeline: Pipeline = {
    drafts_active: (data.pipeline?.drafts_active ?? []).map(scrubDraft),
    finalized_today: (data.pipeline?.finalized_today ?? []).map(scrubDraft),
  }

  // Scrub token entries — drop `session_id`
  const token_usage: TokenEntry[] = (data.token_usage ?? []).map(
    (t: Record<string, any>) => ({
      input_tokens: t.input_tokens,
      output_tokens: t.output_tokens,
      cache_read_tokens: t.cache_read_tokens ?? 0,
      cache_write_tokens: t.cache_write_tokens ?? 0,
      model: t.model,
      source: t.source,
      ...(t.messages != null ? { messages: t.messages } : {}),
      ...(t.confidence != null ? { confidence: t.confidence } : {}),
      ...(t.context != null ? { context: t.context } : {}),
      logged_at: t.logged_at,
      cost: t.cost ?? null,
    }),
  )

  // Scrub git summary — drop files_added, files_modified (but compute files_touched first)
  const git_summary: GitSummary = {
    commits_today: data.git_summary?.commits_today ?? 0,
    files_touched: (data.git_summary?.files_added?.length ?? 0) +
                   (data.git_summary?.files_modified?.length ?? 0),
  }

  // Scrub V4 commits — strip paths from messages, pass through safe fields
  const BLOCKLIST = /\/(Users|home|clients|partner|client)\b[^\s]*/gi
  const commits: Commit[] | undefined = data.commits
    ? (data.commits as Record<string, any>[]).map((c) => ({
        hash: c.hash,
        message: (c.message ?? '').replace(BLOCKLIST, '<path>'),
        type: c.type,
        score: c.score ?? 0,
        files_changed: c.files_changed ?? 0,
        lines_added: c.lines_added ?? 0,
        lines_removed: c.lines_removed ?? 0,
        lines_net: c.lines_net ?? 0,
        directories: c.directories ?? [],
        timestamp: c.timestamp ?? '',
      }))
    : undefined

  // V4 passthrough fields (no sensitive data)
  const dev_equivalent: DevEquivalent | undefined = data.dev_equivalent ?? undefined
  const cost: CostSection | undefined = data.cost ?? undefined
  const token_efficiency: TokenEfficiency | undefined = data.token_efficiency ?? undefined

  return {
    date: data.date,
    generated_at: data.generated_at,
    version: data.version ?? 3,
    accomplishments,
    pipeline,
    todos: data.todos ?? [],
    token_usage,
    stats: data.stats ?? {
      platform_breakdown: {},
      words_today: 0,
      pipeline_words: 0,
      finals_count: 0,
      first_activity: '',
      last_activity: '',
      output_score: 0,
      letter_grade: 'D',
      score_breakdown: [],
      efficiency_rating: null,
    },
    git_summary,
    ...(commits ? { commits } : {}),
    ...(dev_equivalent ? { dev_equivalent } : {}),
    ...(cost ? { cost } : {}),
    ...(token_efficiency ? { token_efficiency } : {}),
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Returns an array of date strings (YYYY-MM-DD) for every daily log JSON,
 * sorted newest-first.
 */
export function getLogDates(logDir: string): string[] {
  const exists = fs.existsSync(logDir)
  if (!exists) return []
  return fs
    .readdirSync(logDir)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .sort((a, b) => (a > b ? -1 : 1))
}

/**
 * Reads and privacy-scrubs a single daily log by date string.
 */
export function getLogByDate(date: string, logDir: string): DailyLog | null {
  const fullPath = path.join(logDir, `${date}.json`)
  if (!fs.existsSync(fullPath)) return null

  const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8')) as Record<string, unknown>
  return scrubLog(raw)
}

/* ------------------------------------------------------------------ */
/*  Aggregate stats across all logs                                    */
/* ------------------------------------------------------------------ */

export interface LogAggregates {
  totalDays: number
  totalShipped: number
  totalWords: number
  totalCommits: number
  totalFinals: number
}

/**
 * Computes totals across every available daily log in `logDir`.
 * Used by the LogHero component on the /log index page.
 */
export function getLogAggregates(logDir: string): LogAggregates {
  const dates = getLogDates(logDir)
  let totalShipped = 0
  let totalWords = 0
  let totalCommits = 0
  let totalFinals = 0

  for (const date of dates) {
    const log = getLogByDate(date, logDir)
    if (!log) continue
    totalShipped += log.accomplishments.length
    totalWords += log.stats.words_today
    totalCommits += log.git_summary.commits_today
    totalFinals += log.stats.finals_count
  }

  return {
    totalDays: dates.length,
    totalShipped,
    totalWords,
    totalCommits,
    totalFinals,
  }
}

/**
 * Returns a 7-day Mon–Sun window of WeekDaySummary[] centered on `centerDate`.
 * Used by the "This Week" panel in DailyLogView.
 */
export function getWeeklyContext(centerDate: string, logDir: string): WeekDaySummary[] {
  const [y, m, d] = centerDate.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  // Find Monday of this week (JS: 0=Sun)
  const dow = dt.getDay()
  const monOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(dt)
  monday.setDate(monday.getDate() + monOffset)

  const result: WeekDaySummary[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    const dateStr = [
      day.getFullYear(),
      String(day.getMonth() + 1).padStart(2, '0'),
      String(day.getDate()).padStart(2, '0'),
    ].join('-')

    const log = getLogByDate(dateStr, logDir)
    result.push({
      date: dateStr,
      commits: log?.git_summary.commits_today ?? 0,
      score: log?.stats.output_score ?? 0,
      grade: log?.stats.letter_grade ?? '-',
    })
  }
  return result
}

/**
 * Returns lightweight summaries for every daily log, sorted newest-first.
 * Used on the /log index page.
 */
export function getAllLogs(logDir: string): DailyLogSummary[] {
  const dates = getLogDates(logDir)
  return dates.map((date) => {
    const log = getLogByDate(date, logDir)
    if (!log) {
      return {
        date,
        output_score: 0,
        letter_grade: 'D',
        accomplishment_count: 0,
        words_today: 0,
        finals_count: 0,
        commits_today: 0,
      }
    }
    return {
      date,
      output_score: log.stats.output_score,
      letter_grade: log.stats.letter_grade,
      accomplishment_count: log.accomplishments.length,
      words_today: log.stats.words_today,
      finals_count: log.stats.finals_count,
      commits_today: log.git_summary.commits_today,
    }
  })
}
