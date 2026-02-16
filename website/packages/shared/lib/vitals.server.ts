import fs from 'fs'
import path from 'path'

import type { WebsiteStats } from './vitals'

/* ------------------------------------------------------------------ */
/*  Server-only Vitals helpers                                         */
/*                                                                     */
/*  These functions use Node.js fs/path and MUST only be imported      */
/*  from server components or server-side code.                        */
/* ------------------------------------------------------------------ */

/**
 * Reads `data/website-stats.json` and returns typed WebsiteStats.
 * Returns `null` if the file doesn't exist (scanner hasn't run).
 *
 * @param dataRoot - Absolute path to the repository root `data/` directory.
 */
export function getWebsiteStats(dataRoot: string): WebsiteStats | null {
  const statsPath = path.join(dataRoot, 'website-stats.json')
  if (!fs.existsSync(statsPath)) return null

  try {
    return JSON.parse(fs.readFileSync(statsPath, 'utf8')) as WebsiteStats
  } catch {
    return null
  }
}
