import path from 'path'
import {
  getAllLogs,
  resolveDataRoot,
  feedResponse,
  getFeedConfig,
  dailyLogsToFeedItems,
  howToWikiToFeedItems,
  knowledgeToFeedItems,
  gtmTermsToFeedItems,
  clayWikiToFeedItems,
  mergeFeedItems,
} from '@shawnos/shared/lib'
import { getHowToWikiEntriesBySite } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'

const SITE_URL = 'https://thegtmos.ai'
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export function GET() {
  const config = getFeedConfig('gtmos', {
    title: 'theGTMOS.ai — Latest Updates',
    description:
      'Every new article, wiki entry, feature, and system update on theGTMOS.ai. GTM knowledge, Clay wiki, how-to guides, engineering terms, daily logs, and more.',
    feedPath: '/feed/updates.xml',
  })

  const gtmHowTos = getHowToWikiEntriesBySite('gtmos')

  const items = mergeFeedItems(
    dailyLogsToFeedItems(getAllLogs(LOG_DIR), SITE_URL),
    howToWikiToFeedItems(gtmHowTos, SITE_URL),
    knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL),
    gtmTermsToFeedItems(GTM_CATEGORIES, SITE_URL, '/knowledge/gtm'),
    clayWikiToFeedItems(CLAY_WIKI_ENTRIES, SITE_URL),
  )

  return feedResponse(config, items)
}
