import path from 'path'
import {
  feedResponse,
  getFeedConfig,
  knowledgeToFeedItems,
  gtmTermsToFeedItems,
  clayWikiToFeedItems,
  howToWikiToFeedItems,
  dailyLogsToFeedItems,
  mergeFeedItems,
  SITE_URLS,
} from '@shawnos/shared/lib/rss'
import { getAllLogs } from '@shawnos/shared/lib'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'

const SITE_URL = SITE_URLS.gtmos
const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export function GET() {
  const config = getFeedConfig('gtmos', {
    title: 'theGTMOS.ai — All Content',
    description:
      'The GTM Operating System — knowledge base for go-to-market engineering.',
    feedPath: '/feed.xml',
  })

  const items = mergeFeedItems(
    knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL, '/knowledge'),
    gtmTermsToFeedItems(GTM_CATEGORIES, SITE_URL, '/knowledge/gtm'),
    clayWikiToFeedItems(CLAY_WIKI_ENTRIES, SITE_URL, '/clay-wiki'),
    howToWikiToFeedItems(HOW_TO_WIKI_ENTRIES, SITE_URL, '/how-to'),
    dailyLogsToFeedItems(getAllLogs(LOG_DIR), SITE_URL),
  )

  return feedResponse(config, items)
}
