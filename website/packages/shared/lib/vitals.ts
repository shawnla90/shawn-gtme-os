/**
 * ShawnOS — Proprietary System Architecture
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 */

/* ------------------------------------------------------------------ */
/*  Vitals Types & Helpers                                             */
/*                                                                     */
/*  This file is CLIENT-SAFE — no Node.js built-ins (fs, path).       */
/*  Server-only helpers that read from disk live in vitals.server.ts.  */
/* ------------------------------------------------------------------ */

/* ── JSON Schema Types ─────────────────────────────── */

export interface SiteLOC {
  tsx?: number
  ts?: number
  css?: number
  json?: number
  py?: number
  [key: string]: number | undefined
}

export interface SiteStats {
  name: string
  accent: string
  score: number
  grade: string
  loc: SiteLOC
  routes: number
  route_list: string[]
  components: number
  api_endpoints: number
  api_endpoint_list: string[]
  features: string[]
  feature_count: number
}

export interface TechnicalFeature {
  name: string
  description: string
  points: number
}

export interface NioProgress {
  current: number
  needed: number
  percent: number
  next_tier: number
  next_tier_name: string
}

export interface SharedStats {
  components: number
  component_list: string[]
  design_tokens: boolean
  loc: SiteLOC
}

export interface InfraStats {
  monorepo: boolean
  vercel_sites: number
  total_loc: number
  loc_by_language: SiteLOC
  languages: string[]
  technical_features: TechnicalFeature[]
}

export interface WebsiteStats {
  generated_at: string
  total_score: number
  grade: string
  nio_tier: number
  nio_tier_name: string
  nio_progress: NioProgress
  sites: {
    shawnos: SiteStats
    gtmos: SiteStats
    contentos: SiteStats
  }
  shared: SharedStats
  infra: InfraStats
}

/* ── Nio Tier Metadata ─────────────────────────────── */

export interface NioTierInfo {
  tier: number
  name: string
  minScore: number
  maxScore: number
}

export const NIO_TIERS: NioTierInfo[] = [
  { tier: 1, name: 'Spark', minScore: 0, maxScore: 10000 },
  { tier: 2, name: 'Blade', minScore: 10000, maxScore: 20000 },
  { tier: 3, name: 'Warden', minScore: 20000, maxScore: 35000 },
  { tier: 4, name: 'Sentinel', minScore: 35000, maxScore: 50000 },
  { tier: 5, name: 'Ascended', minScore: 50000, maxScore: Infinity },
]

/* ── Helpers ────────────────────────────────────────── */

/** Nio avatar asset URLs (served from public/progression/avatars/). */
export function getNioAvatarUrls(tier: number): { idle: string; static: string } {
  const t = Math.max(1, Math.min(5, tier))
  const base = '/progression/avatars'
  return {
    idle: `${base}/nio-tier-${t}-idle.gif`,
    static: `${base}/nio-tier-${t}-static.png`,
  }
}

/** Sum all values in a SiteLOC record. */
export function totalLOC(loc: SiteLOC): number {
  return Object.values(loc).reduce<number>((sum, v) => sum + (v ?? 0), 0)
}

/** Format a number with commas. */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

/** Grade color mapping. */
export function gradeColor(grade: string): string {
  switch (grade) {
    case 'S': return '#FBBF24'
    case 'A': return '#8B5CF6'
    case 'B': return '#10B981'
    case 'C': return '#06B6D4'
    case 'D': return '#F59E0B'
    case 'F': return '#EF4444'
    default: return '#64748B'
  }
}

/** Language display names and colors for code composition. */
export const LANGUAGE_COLORS: Record<string, { label: string; color: string }> = {
  tsx: { label: 'TSX', color: '#3178C6' },
  ts: { label: 'TypeScript', color: '#2563EB' },
  css: { label: 'CSS', color: '#A855F7' },
  json: { label: 'JSON', color: '#F59E0B' },
  py: { label: 'Python', color: '#10B981' },
}
