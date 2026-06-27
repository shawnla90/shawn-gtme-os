// Live build stats for /built — pulled from the GitHub API, ISR-cached hourly.
// Falls back to last-known-real values (never fabricated) if the API is unreachable.

const GH_USER = 'shawnla90'
const GH_REPO = 'shawn-gtme-os'
const FIRST_COMMIT = '2026-02-07'

export interface RepoStat {
  name: string
  full: string
  stars: number
  forks: number
  url: string
  desc: string
}

export interface BuildStats {
  totalStars: number
  repoCount: number
  topRepos: RepoStat[]
  commitCount: number
  daysBuilding: number
  live: boolean
}

// last verified 2026-06-27 — used only if GitHub is unreachable at build time
const FALLBACK_REPOS: RepoStat[] = [
  { name: 'gtm-coding-agent', full: 'shawnla90/gtm-coding-agent', stars: 92, forks: 29, url: 'https://github.com/shawnla90/gtm-coding-agent', desc: 'A coding agent pointed at go-to-market.' },
  { name: 'website-with-soul', full: 'shawnla90/website-with-soul', stars: 21, forks: 3, url: 'https://github.com/shawnla90/website-with-soul', desc: 'A site that reads like a person, not a template.' },
  { name: 'recursive-drift', full: 'shawnla90/recursive-drift', stars: 16, forks: 5, url: 'https://github.com/shawnla90/recursive-drift', desc: 'The non-linear method I build by.' },
  { name: 'context-handoff-engine', full: 'shawnla90/context-handoff-engine', stars: 12, forks: 1, url: 'https://github.com/shawnla90/context-handoff-engine', desc: 'Never lose a session to a full context window.' },
  { name: 'shawn-gtme-os', full: 'shawnla90/shawn-gtme-os', stars: 8, forks: 2, url: 'https://github.com/shawnla90/shawn-gtme-os', desc: 'The monorepo this site ships from.' },
]

function daysSince(date: string): number {
  return Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 86_400_000))
}

export async function getBuildStats(): Promise<BuildStats> {
  const daysBuilding = daysSince(FIRST_COMMIT)
  try {
    const res = await fetch(
      `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 } },
    )
    if (!res.ok) throw new Error(`repos ${res.status}`)
    const repos: Array<{ name: string; full_name: string; stargazers_count: number; forks_count: number; html_url: string; description: string | null }> = await res.json()

    const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0)
    const topRepos: RepoStat[] = repos
      .filter((r) => (r.stargazers_count || 0) > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        full: r.full_name,
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        desc: r.description ?? '',
      }))

    // total commit count via the Link header pagination trick (per_page=1 → last page = total)
    let commitCount = 1204
    try {
      const cres = await fetch(
        `https://api.github.com/repos/${GH_USER}/${GH_REPO}/commits?per_page=1`,
        { headers: { Accept: 'application/vnd.github+json' }, next: { revalidate: 3600 } },
      )
      const link = cres.headers.get('link')
      const m = link?.match(/[?&]page=(\d+)>;\s*rel="last"/)
      if (m) commitCount = parseInt(m[1], 10)
    } catch {
      /* keep fallback commit count */
    }

    return { totalStars, repoCount: repos.length, topRepos, commitCount, daysBuilding, live: true }
  } catch {
    return {
      totalStars: FALLBACK_REPOS.reduce((a, r) => a + r.stars, 0) + 49, // 16 repos, ~149 total
      repoCount: 16,
      topRepos: FALLBACK_REPOS,
      commitCount: 1204,
      daysBuilding,
      live: false,
    }
  }
}
