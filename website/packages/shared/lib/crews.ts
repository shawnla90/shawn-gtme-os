/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

/* ------------------------------------------------------------------ */
/*  Agent Crew Types                                                   */
/*                                                                     */
/*  This file is CLIENT-SAFE — no Node.js built-ins (fs, path).       */
/* ------------------------------------------------------------------ */

/** A single agent within a crew */
export interface CrewAgent {
  id: string
  name: string
  role: string
  model: string
  provider: string
  description: string
  skills: string[]
  status: 'active' | 'idle' | 'error'
  cost_per_run: number
}

/** A crew of agents working together */
export interface Crew {
  id: string
  name: string
  description: string
  workflow: 'sequential' | 'parallel' | 'independent'
  agents: CrewAgent[]
  cron_jobs: string[]
  handoff_dir: string
  last_run: string | null
  total_runs: number
  total_cost: number
}

/** Crew status for dashboard display */
export interface CrewStatus {
  phase: string
  agents_active: number
  last_output: string
  errors: string[]
}

/** Full crews config */
export interface CrewsConfig {
  version: number
  updated_at: string
  crews: Crew[]
}
