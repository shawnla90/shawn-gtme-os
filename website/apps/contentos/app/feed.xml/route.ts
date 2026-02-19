import path from 'path'
import { getAllLogs, feedResponse, getFeedConfig } from '@shawnos/shared/lib'
import {
  contentWikiToFeedItems,
  howToWikiToFeedItems,
  dailyLogsToFeedItems,
  mergeFeedItems,
} from '@shawnos/shared/lib/rss'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'

const SITE_URL = 'https://thecontentos.ai'
const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export function GET() {
  const config = getFeedConfig('contentos', {
    title: 'thecontentos.ai — All Content',
    description:
      'The Content Operating System — frameworks and tools for content-driven growth.',
    feedPath: '/feed.xml',
  })

  const contentWiki = contentWikiToFeedItems(CONTENT_WIKI_ENTRIES, SITE_URL)
  const howTo = howToWikiToFeedItems(HOW_TO_WIKI_ENTRIES, SITE_URL)
  const logs = dailyLogsToFeedItems(getAllLogs(LOG_DIR), SITE_URL)

  const items = mergeFeedItems(logs, contentWiki, howTo)

  return feedResponse(config, items)
}
