import {
  feedResponse,
  getFeedConfig,
  clayWikiToFeedItems,
  SITE_URLS,
} from '@shawnos/shared/lib/rss'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'

const SITE_URL = SITE_URLS.gtmos

export function GET() {
  const config = getFeedConfig('gtmos', {
    title: 'theGTMOS.ai — Clay Wiki',
    description: 'Clay platform tips, formulas, and integration guides.',
    feedPath: '/feed/clay-wiki.xml',
  })

  const items = clayWikiToFeedItems(CLAY_WIKI_ENTRIES, SITE_URL, '/clay-wiki')
  return feedResponse(config, items)
}
