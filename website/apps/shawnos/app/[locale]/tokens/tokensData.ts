import raw from '@shawnos/shared/data/tokens-ledger.json'

/** Shape written by ~/limits-tracker/export_public.py. Aggregates only; no identifiers. */
export interface Plan {
  plan: string
  label: string
  start: string
  end: string
  days: number
  active_days: number
  price_usd_month: number | null
  prompts: number | null
  sessions: number | null
  turns: number | null
  tokens: number
  non_cache_tokens: number | null
  tokens_basis: 'estimate' | 'exact'
  api_equiv_usd: number
  seat_usd: number | null
  billing: string
}
export interface Day {
  d: string
  plan: string
  prompts: number | null
  sessions: number | null
  turns: number | null
  tokens: number | null
  non_cache: number | null
  cache_read: number | null
  api_usd: number | null
  top_model: string
  gap: boolean
  codex_tokens: number | null
  codex_turns: number | null
}
export interface Month {
  m: string
  plans: string
  prompts: number | null
  tokens: number | null
  non_cache: number | null
  api_usd: number | null
}
export interface ModelRow {
  model: string
  family: string
  tokens: number
  api_equiv_usd: number
  price: { in: number; out: number; cache_write: number; cache_read: number }
}
export interface WindowRow {
  plan: string
  label: string
  polls: number
  peak: number
  capped_polls: number
  pct_per_mtok: number | null
  mtok_per_window: number | null
  sample_mtok: number
}
export interface Ledger {
  generated_at: string
  range: { start: string; end: string }
  gap: { start: string; end: string; reason: string }
  totals: {
    tokens: number
    non_cache_tokens: number
    prompts: number
    sessions: number
    turns: number
    days: number
    api_equiv_usd: number
    cache_read_share: number
    output_share: number
  }
  composition: { input: number; output: number; cache_write: number; cache_read: number }
  plans: Plan[]
  spend: { seats_usd: number; api_estimate_usd: number; api_estimate_source: string; leverage_x: number | null }
  daily: Day[]
  monthly: Month[]
  by_model: ModelRow[]
  codex: { since: string | null; turns: number; tokens: number; api_equiv_usd: number; pricing_note: string }
  limits: { since: string | null; window: string; windows: WindowRow[]; note: string }
  pricing: { family: string; in: number; out: number; cache_write: number; cache_read: number }[]
  sources: { name: string; note: string }[]
}

export const ledger = raw as unknown as Ledger

/* ── formatters ─────────────────────────────────────── */

export const fmtInt = (n: number | null | undefined) =>
  n == null ? '' : Math.round(n).toLocaleString('en-US')

/** 18,037,167,864 → 18.04B · 410,403,629 → 410M · 2,300,000 → 2.3M */
export const fmtTok = (n: number | null | undefined) => {
  if (n == null) return ''
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e8) return `${Math.round(n / 1e6)}M`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`
  return String(n)
}

export const fmtUsd = (n: number | null | undefined, digits = 0) =>
  n == null
    ? ''
    : `$${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`

export const fmtPct = (share: number, digits = 1) => `${(share * 100).toFixed(digits)}%`

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: y === new Date().getUTCFullYear() ? undefined : 'numeric',
    timeZone: 'UTC',
  })
}

export const fmtMonth = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
}

/** Plan accent per epoch; stays on the site palette, only the alpha changes. */
export const PLAN_TONE: Record<string, string> = {
  'Max 20x': 'rgba(109, 94, 233, 0.34)',
  'Max 5x': 'rgba(109, 94, 233, 0.22)',
  Team: 'rgba(109, 94, 233, 0.12)',
}

export const modelDisplay = (m: string) =>
  m.replace('claude-', '').replace('-20251001', '').replace('gpt-5.x', 'gpt-5.x (proxy)')

/** Biggest single day, used in the hero and the chart caption. */
export const peakDay = (days: Day[]) =>
  days.reduce<Day | null>((best, d) => (d.tokens != null && (best == null || d.tokens > (best.tokens ?? 0)) ? d : best), null)
