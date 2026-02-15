import path from 'path'
import fs from 'fs'

/**
 * Resolves the repo's data/ directory. Tries multiple candidates
 * so it works whether cwd is website/apps/shawnos, website/, or repo root.
 */
export function resolveDataRoot(cwd: string = process.cwd()): string {
  const candidates = [
    path.join(cwd, '../../../data'), // from apps/shawnos
    path.join(cwd, '../../data'), // from website/
    path.join(cwd, 'data'), // from repo root
  ]
  for (const p of candidates) {
    const progression = path.join(p, 'progression')
    if (fs.existsSync(progression)) return p
  }
  return candidates[0]! // fallback to first (may 404 at runtime)
}
