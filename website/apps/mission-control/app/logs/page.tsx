import { getAllLogs, getLogAggregates, resolveDataRoot, getRPGProfile } from '@shawnos/shared/lib'
import path from 'path'
import LogIndex from '../components/LogIndex'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export default async function LogsPage() {
  const logs = getAllLogs(LOG_DIR)
  const aggregates = getLogAggregates(LOG_DIR)
  const profile = getRPGProfile(DATA_ROOT)

  return <LogIndex logs={logs} aggregates={aggregates} profile={profile} v2Grades={{}} />
}
