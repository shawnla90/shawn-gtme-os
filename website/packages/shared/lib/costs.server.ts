import fs from 'fs'
import path from 'path'

import type { CostBreakdown, CostAnalytics } from './costs'

/* ------------------------------------------------------------------ */
/*  Server-only cost analytics helpers                                 */
/* ------------------------------------------------------------------ */

/**
 * Reads all cost-tracker JSON files and returns aggregated analytics.
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 */
export function getCostAnalytics(dataRoot: string): CostAnalytics {
  const trackerDir = path.join(dataRoot, 'daily-log', 'cost-tracker')
  const days: CostBreakdown[] = []

  if (!fs.existsSync(trackerDir)) {
    return { days: [], total_spend: 0, avg_daily: 0, model_totals: {}, source_totals: {} }
  }

  const files = fs.readdirSync(trackerDir)
    .filter((f) => f.endsWith('.json'))
    .sort()

  for (const file of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(trackerDir, file), 'utf8'))
      if (raw.date && typeof raw.total_cost === 'number') {
        days.push(raw as CostBreakdown)
      }
    } catch {
      continue
    }
  }

  const total_spend = days.reduce((s, d) => s + d.total_cost, 0)
  const avg_daily = days.length > 0 ? total_spend / days.length : 0

  const model_totals: Record<string, number> = {}
  const source_totals: Record<string, number> = {}

  for (const day of days) {
    for (const [model, cost] of Object.entries(day.by_model)) {
      model_totals[model] = (model_totals[model] ?? 0) + cost
    }
    for (const [source, cost] of Object.entries(day.by_source)) {
      source_totals[source] = (source_totals[source] ?? 0) + cost
    }
  }

  return { days, total_spend, avg_daily, model_totals, source_totals }
}
