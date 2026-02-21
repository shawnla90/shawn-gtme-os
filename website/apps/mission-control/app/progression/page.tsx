import { getAllLogs, resolveDataRoot } from '@shawnos/shared/lib'
import { getRPGProfileV3 } from '@shawnos/shared/lib'
import { getRPGProfileV2 } from '@shawnos/shared/lib'
import { getLogByDate } from '@shawnos/shared/lib'
import path from 'path'
import Link from 'next/link'
import ProgressionProfile from '../components/ProgressionProfile'
import ProgressionXPGraph from '../components/ProgressionXPGraph'
import ProgressionGradeTable from '../components/ProgressionGradeTable'
import ProgressionChainViz from '../components/ProgressionChainViz'
import ProgressionClassBreakdown from '../components/ProgressionClassBreakdown'
import ProgressionMilestones from '../components/ProgressionMilestones'
import ProgressionTokenEfficiency from '../components/ProgressionTokenEfficiency'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export default async function ProgressionPage() {
  // Try V3 first, fall back to V2
  const profileV3 = getRPGProfileV3(DATA_ROOT)
  const profileV2 = getRPGProfileV2(DATA_ROOT)
  const profile = profileV3 ?? profileV2
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

  // Normalize scoring log — V3 uses v3_meta, V2 uses v2_meta
  const isV3 = !!profileV3
  const meta = isV3 ? profileV3!.v3_meta : profileV2?.v2_meta
  const scoringLog = meta?.scoring_log ?? []

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-300 mb-1">PROGRESSION</h1>
          <p className="text-sm text-gray-500">XP, grades & leveling</p>
        </div>
        <div className="text-xs text-gray-600 bg-gray-900 px-2 py-1 rounded">
          Engine {isV3 ? 'v3' : 'v2'}
        </div>
      </div>

      {/* Profile hero */}
      <ProgressionProfile profile={profile} />

      {/* XP graph */}
      <ProgressionXPGraph scoringLog={scoringLog} isV3={isV3} />

      {/* Grade table */}
      <ProgressionGradeTable scoringLog={scoringLog} isV3={isV3} />

      {/* Chain viz + Class breakdown side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meta && (
          <ProgressionChainViz meta={meta} scoringLog={scoringLog} isV3={isV3} />
        )}
        {meta && (
          <ProgressionClassBreakdown currentClass={profile.class} meta={meta} />
        )}
      </div>

      {/* Milestones */}
      <ProgressionMilestones milestones={profile.milestones} />

      {/* Token efficiency */}
      <ProgressionTokenEfficiency
        scoringLog={scoringLog}
        logs={logs}
        costMap={costMap}
        isV3={isV3}
      />
    </div>
  )
}
