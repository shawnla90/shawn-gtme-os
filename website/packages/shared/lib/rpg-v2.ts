/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

/* ------------------------------------------------------------------ */
/*  RPG v2 Types                                                       */
/*                                                                     */
/*  Extends RPGProfile with v2_meta for the v2 progression engine.     */
/*  This file is CLIENT-SAFE — no Node.js built-ins (fs, path).       */
/* ------------------------------------------------------------------ */

import type { RPGProfile, Milestone } from './rpg'

/** Per-day scoring record from progression_engine_v2.py */
export interface V2ScoringEntry {
  date: string
  raw_score: number
  v1_grade: string
  v2_grade: string
  chain_length: number
  chain_mult: number
  efficiency_bonus: number
  velocity_bonus: number
  ship_bonus: number
  total_mult: number
  v2_xp: number
}

/** v2 metadata block attached to the profile */
export interface V2Meta {
  engine_version: string
  v1_xp_total: number
  xp_delta: number
  current_ascending_chain: number
  chain_multiplier: number
  longest_chain: number
  class_window: string
  class_breakdown: Record<string, number>
  grade_thresholds: Record<string, number>
  scoring_log: V2ScoringEntry[]
}

/** Full v2 profile — extends RPGProfile with v2_meta */
export interface RPGProfileV2 extends RPGProfile {
  v2_meta: V2Meta
}

/** v2 grade thresholds for reference */
export const GRADE_THRESHOLDS_V2: Record<string, number> = {
  'S+': 850,
  S: 600,
  'A+': 450,
  A: 300,
  B: 150,
  C: 50,
  D: 0,
}

/** Returns the v2 grade color for styling */
export function gradeColorV2(grade: string): string {
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
