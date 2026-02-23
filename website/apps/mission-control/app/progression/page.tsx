import { getAllLogs, resolveDataRoot, getRPGProfile, getLogByDate } from '@shawnos/shared/lib'
import path from 'path'
import Link from 'next/link'
import ProgressionProfile from '../components/ProgressionProfile'
import ProgressionXPGraph from '../components/ProgressionXPGraph'
import ProgressionGradeTable from '../components/ProgressionGradeTable'
import ProgressionStreakViz from '../components/ProgressionChainViz'
import ProgressionClassBreakdown from '../components/ProgressionClassBreakdown'
import ProgressionMilestones from '../components/ProgressionMilestones'
import ProgressionTokenEfficiency from '../components/ProgressionTokenEfficiency'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export default async function ProgressionPage() {
  const profile = getRPGProfile(DATA_ROOT)
  const logs = getAllLogs(LOG_DIR)

  if (!profile) {
    return (
      <div className="space-y-6">
        <Link href="/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
          &larr; Dashboard
        </Link>
        <div className="card text-center py-12">
          <p className="text-gray-500">Progression engine has not run yet.</p>
          <p className="text-xs text-gray-600 mt-2">Run the daily cron to generate profile data.</p>
        </div>
      </div>
    )
  }

  const scoringLog = profile.scoring_log ?? []

  // Build cost map from daily logs
  const costMap: Record<string, number> = {}
  for (const summary of logs) {
    const log = getLogByDate(summary.date, LOG_DIR)
    if (log) {
      costMap[summary.date] = log.token_usage.reduce((s, t) => s + (t.cost ?? 0), 0)
    }
  }

  return (
    <div className="space-y-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
          &larr; Dashboard
        </Link>
        <Link href="/logs" className="text-sm text-green-600 hover:text-green-400 transition-colors">
          View Daily Logs &rarr;
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">PROGRESSION</h1>
        <p className="text-sm text-gray-500">XP, grades & leveling</p>
      </div>

      {/* Profile hero */}
      <ProgressionProfile profile={profile} />

      {/* XP graph */}
      <ProgressionXPGraph scoringLog={scoringLog} />

      {/* Grade table */}
      <ProgressionGradeTable scoringLog={scoringLog} />

      {/* Streak viz + Class display side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProgressionStreakViz scoringLog={scoringLog} profile={profile} />
        <ProgressionClassBreakdown currentClass={profile.class} />
      </div>

      {/* Milestones */}
      <ProgressionMilestones milestones={profile.milestones} />

      {/* Token efficiency */}
      <ProgressionTokenEfficiency
        scoringLog={scoringLog}
        logs={logs}
        costMap={costMap}
      />
    </div>
  )
}
