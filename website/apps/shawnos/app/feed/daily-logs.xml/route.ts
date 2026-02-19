import path from 'path'
import { getAllLogs, resolveDataRoot, feedResponse, getFeedConfig, dailyLogsToFeedItems } from '@shawnos/shared/lib'

const SITE_URL = 'https://shawnos.ai'
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export function GET() {
  const logs = getAllLogs(LOG_DIR)
  const config = getFeedConfig('shawnos', {
    title: 'shawnos.ai — Daily Logs',
    description: 'Daily output logs, scores, and accomplishments.',
    feedPath: '/feed/daily-logs.xml',
  })
  const items = dailyLogsToFeedItems(logs, SITE_URL)
  return feedResponse(config, items)
}
