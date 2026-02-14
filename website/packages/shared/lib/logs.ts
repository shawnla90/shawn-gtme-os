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
}

export interface GitSummary {
  commits_today: number
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

  // Scrub git summary — drop files_added, files_modified
  const git_summary: GitSummary = {
    commits_today: data.git_summary?.commits_today ?? 0,
  }

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
  if (!fs.existsSync(logDir)) return []
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

  const raw = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
  return scrubLog(raw)
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
