/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

/* ------------------------------------------------------------------ */
/*  RPG v3 Types                                                       */
/*                                                                     */
/*  Extends RPGProfile with v3_meta for the v3 progression engine.     */
/*  This file is CLIENT-SAFE — no Node.js built-ins (fs, path).       */
/* ------------------------------------------------------------------ */

import type { RPGProfile, Milestone } from './rpg'

/** Per-day scoring record from progression_engine_v3.py */
export interface V3ScoringEntry {
  date: string
  raw_score: number
  base_score: number
  v2_grade: string
  v3_grade: string
  ascending_chain: number
  ascending_bonus: number
  streak_days: number
  streak_bonus: number
  momentum_mult: number
  quality_bonus: number
  type_diversity: number
  high_value_ratio: number
  efficiency_bonus: number
  velocity_bonus: number
  ship_bonus: number
  total_bonus: number
  total_mult: number
  v3_xp: number
}

/** v3 metadata block attached to the profile */
export interface V3Meta {
  engine_version: string
  v1_xp_total: number
  xp_delta_from_v1: number
  current_ascending_chain: number
  current_streak: number
  longest_chain: number
  longest_streak: number
  momentum_mult: number
  class_window: string
  class_breakdown: Record<string, number>
  grade_thresholds: Record<string, number>
  scoring_log: V3ScoringEntry[]
}

/** Full v3 profile — extends RPGProfile with v3_meta */
export interface RPGProfileV3 extends RPGProfile {
  v3_meta: V3Meta
}

/** v3 grade thresholds — based on v3_xp, not raw score */
export const GRADE_THRESHOLDS_V3: Record<string, number> = {
  'S+': 1200,
  S: 850,
  'A+': 600,
  A: 400,
  B: 200,
  C: 75,
  D: 0,
}

/** Returns the v3 grade color for styling */
export function gradeColorV3(grade: string): string {
  switch (grade) {
    case 'S+':
      return '#FBBF24'
    case 'S':
      return '#8B5CF6'
    case 'A+':
      return '#06B6D4'
    case 'A':
      return '#10B981'
    case 'B':
      return '#64748B'
    case 'C':
      return '#94A3B8'
    default:
      return '#475569'
  }
}
