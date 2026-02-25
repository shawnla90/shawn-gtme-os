import { NextResponse } from 'next/server'
import { PROJECTS } from '../../lib/projects'
import { execSync } from 'child_process'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  const repoRoot = path.join(process.cwd(), '..', '..', '..')

  const enriched = PROJECTS.map((project) => {
    let recentCommits: { hash: string; message: string; date: string; author: string }[] = []
    let commitCount = 0

    try {
      const log = execSync(
        `git log --oneline --format="%H|%s|%ai|%an" -10 -- "${project.path}"`,
        { cwd: repoRoot, encoding: 'utf-8', timeout: 5000 }
      ).trim()

      if (log) {
        recentCommits = log.split('\n').map((line) => {
          const [hash, message, date, author] = line.split('|')
          return { hash: hash?.slice(0, 7) ?? '', message: message ?? '', date: date ?? '', author: author ?? '' }
        })
      }

      const countStr = execSync(
        `git rev-list --count HEAD -- "${project.path}"`,
        { cwd: repoRoot, encoding: 'utf-8', timeout: 5000 }
      ).trim()
      commitCount = parseInt(countStr, 10) || 0
    } catch {
      // git might not be available
    }

    return {
      ...project,
      recentCommits,
      commitCount,
    }
  })

  return NextResponse.json({ projects: enriched })
}
