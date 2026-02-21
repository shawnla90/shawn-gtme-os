import fs from 'fs'
import path from 'path'

import type { RPGProfileV2 } from './rpg-v2'
import { DEFAULT_PROFILE } from './rpg'

/* ------------------------------------------------------------------ */
/*  Server-only v2 RPG helpers                                         */
/*                                                                     */
/*  These functions use Node.js fs/path and MUST only be imported      */
/*  from server components or server-side code.                        */
/* ------------------------------------------------------------------ */

/**
 * Reads `data/progression/profile-v2.json` and returns a typed RPGProfileV2.
 * Returns `null` if the file doesn't exist (v2 engine hasn't run).
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 */
export function getRPGProfileV2(dataRoot: string): RPGProfileV2 | null {
  const profilePath = path.join(dataRoot, 'progression', 'profile-v2.json')
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
      v2_meta: raw.v2_meta ?? null,
    }
  } catch {
    return null
  }
}
