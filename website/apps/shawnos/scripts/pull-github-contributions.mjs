#!/usr/bin/env node
// Pull Shawn's GitHub contribution calendar via `gh api graphql` (local auth)
// into packages/shared/data/github-contributions.json for the /built heatmap.
// Run manually or from a cron on the Mac Mini — Railway builds just read the JSON.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const LOGIN = 'shawnla90'
const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../packages/shared/data/github-contributions.json',
)

const query = `
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}`

const raw = execFileSync(
  'gh',
  ['api', 'graphql', '-f', `query=${query}`, '-F', `login=${LOGIN}`],
  { encoding: 'utf8' },
)
const cal = JSON.parse(raw).data.user.contributionsCollection.contributionCalendar
const days = cal.weeks.flatMap((w) => w.contributionDays)

// GitHub-style quartile levels: 0 for none, then 4 buckets over the max
const max = Math.max(1, ...days.map((d) => d.contributionCount))
const level = (c) => (c === 0 ? 0 : Math.min(4, Math.ceil((c / max) * 4)))

const data = days.map((d) => ({
  date: d.date,
  count: d.contributionCount,
  level: level(d.contributionCount),
}))

writeFileSync(
  OUT,
  JSON.stringify(
    { login: LOGIN, total: cal.totalContributions, pulledAt: new Date().toISOString().slice(0, 10), days: data },
    null,
    1,
  ),
)
console.log(`wrote ${data.length} days (${cal.totalContributions} contributions) → ${OUT}`)
