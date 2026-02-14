import fs from 'fs'
import path from 'path'

import type { RPGProfile } from './rpg'
import { DEFAULT_PROFILE } from './rpg'

/* ------------------------------------------------------------------ */
/*  Server-only RPG helpers                                            */
/*                                                                     */
/*  These functions use Node.js fs/path and MUST only be imported      */
/*  from server components or server-side code (getStaticProps, etc).  */
/*  Client components should import from './rpg' instead.              */
/* ------------------------------------------------------------------ */

/**
 * Reads `data/progression/profile.json` and returns a typed RPGProfile.
 * Returns `null` if the file doesn't exist (progression engine hasn't run).
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 *                   Each app passes its own resolved path.
 */
export function getRPGProfile(dataRoot: string): RPGProfile | null {
  const profilePath = path.join(dataRoot, 'progression', 'profile.json')
  if (!fs.existsSync(profilePath)) return null

  try {
    const raw = JSON.parse(fs.readFileSync(profilePath, 'utf8'))
    return {
      name: raw.name ?? DEFAULT_PROFILE.name,
      title: raw.title ?? DEFAULT_PROFILE.title,
      level: raw.level ?? DEFAULT_PROFILE.level,
      xp_total: raw.xp_total ?? DEFAULT_PROFILE.xp_total,
      xp_next_level: raw.xp_next_level ?? DEFAULT_PROFILE.xp_next_level,
      class: raw.class ?? DEFAULT_PROFILE.class,
      avatar_tier: raw.avatar_tier ?? DEFAULT_PROFILE.avatar_tier,
      milestones: Array.isArray(raw.milestones) ? raw.milestones : [],
      updated_at: raw.updated_at ?? '',
    }
  } catch {
    // Malformed JSON — treat as missing
    return null
  }
}

/**
 * Returns the absolute path to `data/progression/avatars/current.png`,
 * or `null` if the file doesn't exist yet.
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 */
export function getAvatarPath(dataRoot: string): string | null {
  const avatarPath = path.join(dataRoot, 'progression', 'avatars', 'current.png')
  if (!fs.existsSync(avatarPath)) return null
  return avatarPath
}

/**
 * Returns the absolute path to an animated avatar GIF (`current-idle.gif`
 * or `current-action.gif`), or `null` if the file doesn't exist yet.
 *
 * Usage:
 * - `idle`   — looping breathing/pulse animation (default display)
 * - `action` — one-shot sword slash / spell cast (shown on hover)
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 * @param type     - Which animation variant to resolve.
 */
export function getAvatarGifPath(
  dataRoot: string,
  type: 'idle' | 'action',
): string | null {
  const gifPath = path.join(
    dataRoot,
    'progression',
    'avatars',
    `current-${type}.gif`,
  )
  if (!fs.existsSync(gifPath)) return null
  return gifPath
}

/**
 * Boolean check: has the RPG progression engine run at least once?
 * True when `data/progression/profile.json` exists and is parseable.
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 */
export function hasRPGData(dataRoot: string): boolean {
  return getRPGProfile(dataRoot) !== null
}
