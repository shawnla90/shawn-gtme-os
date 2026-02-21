import { getAllLogs, getLogAggregates, resolveDataRoot } from '@shawnos/shared/lib'
import { getRPGProfileV3 } from '@shawnos/shared/lib'
import { getRPGProfileV2 } from '@shawnos/shared/lib'
import path from 'path'
import LogIndex from '../components/LogIndex'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export default async function LogsPage() {
  const logs = getAllLogs(LOG_DIR)
  const aggregates = getLogAggregates(LOG_DIR)

  // Try V3 first, fall back to V2
  const profileV3 = getRPGProfileV3(DATA_ROOT)
  const profileV2 = getRPGProfileV2(DATA_ROOT)
  const profile = profileV3 ?? profileV2

  // Build grade overrides from scoring log
  const grades: Record<string, string> = {}
  if (profileV3?.v3_meta?.scoring_log) {
    for (const entry of profileV3.v3_meta.scoring_log) {
      grades[entry.date] = entry.v3_grade
    }
  } else if (profileV2?.v2_meta?.scoring_log) {
    for (const entry of profileV2.v2_meta.scoring_log) {
      grades[entry.date] = entry.v2_grade
    }
  }

  return <LogIndex logs={logs} aggregates={aggregates} profile={profile} v2Grades={grades} />
}
