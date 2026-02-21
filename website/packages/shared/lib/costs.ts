/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

/* ------------------------------------------------------------------ */
/*  Cost Analytics Types                                               */
/*                                                                     */
/*  This file is CLIENT-SAFE — no Node.js built-ins (fs, path).       */
/* ------------------------------------------------------------------ */

/** Per-day cost breakdown from cost_aggregator.py */
export interface CostBreakdown {
  date: string
  total_cost: number
  by_model: Record<string, number>
  by_source: Record<string, number>
  cumulative_total: number
  cost_per_xp_v3: number
}

/** Aggregated cost analytics for the dashboard */
export interface CostAnalytics {
  days: CostBreakdown[]
  total_spend: number
  avg_daily: number
  model_totals: Record<string, number>
  source_totals: Record<string, number>
}
