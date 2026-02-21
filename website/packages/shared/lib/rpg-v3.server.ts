import fs from 'fs'
import path from 'path'

import type { RPGProfileV3 } from './rpg-v3'
import { DEFAULT_PROFILE } from './rpg'

/* ------------------------------------------------------------------ */
/*  Server-only v3 RPG helpers                                         */
/*                                                                     */
/*  These functions use Node.js fs/path and MUST only be imported      */
/*  from server components or server-side code.                        */
/* ------------------------------------------------------------------ */

/**
 * Reads `data/progression/profile-v3.json` and returns a typed RPGProfileV3.
 * Returns `null` if the file doesn't exist (v3 engine hasn't run).
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 */
export function getRPGProfileV3(dataRoot: string): RPGProfileV3 | null {
  const profilePath = path.join(dataRoot, 'progression', 'profile-v3.json')
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
      v3_meta: raw.v3_meta ?? null,
    }
  } catch {
    return null
  }
}
