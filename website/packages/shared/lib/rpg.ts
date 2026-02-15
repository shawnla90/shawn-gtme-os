/* ------------------------------------------------------------------ */
/*  RPG Types, Constants & Title Table                                 */
/*                                                                     */
/*  This file is CLIENT-SAFE — no Node.js built-ins (fs, path).       */
/*  Server-only helpers that read from disk live in rpg.server.ts.     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Types — matches progression_engine.py output schema                */
/* ------------------------------------------------------------------ */

/** A single milestone achievement. */
export interface Milestone {
  id: string
  title: string
  description: string
  unlocked_at: string // ISO-8601
}

/** RPG class specialisation. */
export type RPGClass =
  | 'Builder'
  | 'Scribe'
  | 'Strategist'
  | 'Alchemist'
  | 'Polymath'

/** Full RPG profile as written by progression_engine.py. */
export interface RPGProfile {
  /** Display name / character name */
  name: string
  /** Current RPG title (e.g. "Terminal Initiate", "Repo Architect") */
  title: string
  /** Current level number (1-based) */
  level: number
  /** Total accumulated XP */
  xp_total: number
  /** XP needed to reach the next level */
  xp_next_level: number
  /** Primary RPG class */
  class: RPGClass
  /** Avatar tier (1-6) — determines which visual tier the avatar renders */
  avatar_tier: number
  /** Unlocked milestones */
  milestones: Milestone[]
  /** ISO-8601 timestamp of last profile update */
  updated_at: string
}

/* ------------------------------------------------------------------ */
/*  Title table — used by the skill guide page                         */
/* ------------------------------------------------------------------ */

export interface TitleTier {
  level: number
  title: string
  xp_required: number
  avatar_tier: number
}

/** The full RPG title progression table. */
export const TITLE_TABLE: TitleTier[] = [
  { level: 1, title: 'Terminal Initiate', xp_required: 0, avatar_tier: 1 },
  { level: 5, title: 'Prompt Apprentice', xp_required: 500, avatar_tier: 1 },
  { level: 10, title: 'Repo Architect', xp_required: 2000, avatar_tier: 2 },
  { level: 15, title: 'Pipeline Runner', xp_required: 5000, avatar_tier: 2 },
  { level: 20, title: 'Context Weaver', xp_required: 10000, avatar_tier: 3 },
  { level: 25, title: 'Skill Forger', xp_required: 18000, avatar_tier: 3 },
  { level: 30, title: 'Voice Alchemist', xp_required: 30000, avatar_tier: 4 },
  { level: 35, title: 'System Sovereign', xp_required: 50000, avatar_tier: 4 },
  { level: 40, title: 'OS Architect', xp_required: 80000, avatar_tier: 5 },
  { level: 45, title: 'Cursor Slayer', xp_required: 120000, avatar_tier: 5 },
  { level: 50, title: 'Grand Master Cursor Slayer', xp_required: 200000, avatar_tier: 6 },
]

/* ------------------------------------------------------------------ */
/*  Tier color hierarchy — Option B palette                            */
/* ------------------------------------------------------------------ */

/**
 * Returns the accent color for a given avatar tier.
 * Used for badges, borders, title text, and XP bar fill.
 *
 * When `variant` is `'advanced'`, returns a warmer/red-tinted version
 * of the tier color via CSS `color-mix`, giving upgraded avatars a
 * subtle visual distinction in the UI.
 */
export function tierColor(tier: number, variant?: 'early' | 'advanced'): string {
  let base: string
  switch (tier) {
    case 1: base = '#64748B'; break
    case 2: base = '#10B981'; break
    case 3: base = '#06B6D4'; break
    case 4: base = '#F59E0B'; break
    case 5: base = '#8B5CF6'; break
    case 6: base = '#FBBF24'; break
    default: base = '#64748B'; break
  }
  if (variant === 'advanced') {
    return `color-mix(in srgb, ${base}, #e06060 15%)`
  }
  return base
}

/* ------------------------------------------------------------------ */
/*  Placeholder / default state                                        */
/* ------------------------------------------------------------------ */

/**
 * Returns public URLs for tier avatar assets (idle GIF, action GIF, static PNG).
 * Files are served from public/progression/avatars/ (static assets).
 *
 * @param tier    - Avatar tier (1-6)
 * @param variant - 'early' = basic assets (default); 'advanced' = tier-{n}-*-advanced.gif/png
 *                  When variant is 'advanced', also returns *Fallback URLs for img onError fallback.
 */
export function getTierAvatarUrls(
  tier: number,
  variant?: 'early' | 'advanced',
): {
  idle: string
  action: string
  static: string
  idleFallback?: string
  actionFallback?: string
  staticFallback?: string
} {
  const base = '/progression/avatars'
  const suffix = variant === 'advanced' ? '-advanced' : ''
  const urls = {
    idle: `${base}/tier-${tier}-idle${suffix}.gif`,
    action: `${base}/tier-${tier}-action${suffix}.gif`,
    static: `${base}/tier-${tier}-static${suffix}.png`,
  }
  if (variant === 'advanced') {
    return {
      ...urls,
      idleFallback: `${base}/tier-${tier}-idle.gif`,
      actionFallback: `${base}/tier-${tier}-action.gif`,
      staticFallback: `${base}/tier-${tier}-static.png`,
    }
  }
  return urls
}

/**
 * Determines if a given (level, avatar_tier) corresponds to the "advanced"
 * sprite variant per TITLE_TABLE. First row per tier = early, second = advanced.
 * Tier 6 (single row) is always advanced.
 *
 * Rule: TITLE_TABLE rows at (tier-1)*2 = early, (tier-1)*2+1 = advanced. Tier 6 = advanced.
 */
export function isAdvancedVariant(level: number, avatar_tier: number): boolean {
  if (avatar_tier === 6) return true
  // Find the row that represents this profile: highest row where row.level <= level
  let rowIdx = -1
  for (let i = TITLE_TABLE.length - 1; i >= 0; i--) {
    if (TITLE_TABLE[i]!.level <= level) {
      rowIdx = i
      break
    }
  }
  if (rowIdx < 0) return false
  const row = TITLE_TABLE[rowIdx]!
  // Use this row's avatar_tier for variant lookup (level might land in different tier's row)
  const rowTier = row.avatar_tier
  const advancedIdx = (rowTier - 1) * 2 + 1
  return rowIdx === advancedIdx
}

/**
 * Returns avatar URLs for a given RPG profile, computing the correct
 * early vs advanced variant from TITLE_TABLE.
 */
export function getAvatarUrlsForProfile(profile: RPGProfile): {
  idle: string
  action: string
  static: string
  idleFallback?: string
  actionFallback?: string
  staticFallback?: string
} {
  const variant = isAdvancedVariant(profile.level, profile.avatar_tier)
    ? 'advanced'
    : 'early'
  return getTierAvatarUrls(profile.avatar_tier || 1, variant)
}

/**
 * Returns avatar URLs for a specific RPG Class.
 * Class sprites do not currently have variants or separate action animations.
 */
export function getClassAvatarUrls(
  rpgClass: string
): {
  idle: string
  action: string
  static: string
} {
  const c = rpgClass.toLowerCase()
  const base = '/progression/avatars'
  // No action sprites for classes yet, fallback to idle
  return {
    idle: `${base}/class-${c}-idle.gif`,
    action: `${base}/class-${c}-idle.gif`,
    static: `${base}/class-${c}-static.png`,
  }
}

/** Default profile returned when the progression engine hasn't run yet. */
export const DEFAULT_PROFILE: RPGProfile = {
  name: 'Operator',
  title: 'Terminal Initiate',
  level: 0,
  xp_total: 0,
  xp_next_level: 100,
  class: 'Builder',
  avatar_tier: 0,
  milestones: [],
  updated_at: '',
}
