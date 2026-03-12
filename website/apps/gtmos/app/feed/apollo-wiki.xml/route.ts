import {
  feedResponse,
  getFeedConfig,
  apolloWikiToFeedItems,
  SITE_URLS,
} from '@shawnos/shared/lib/rss'
import { APOLLO_WIKI_ENTRIES } from '@shawnos/shared/data/apollo-wiki'

const SITE_URL = SITE_URLS.gtmos

export function GET() {
  const config = getFeedConfig('gtmos', {
    title: 'theGTMOS.ai — Apollo Wiki',
    description: 'Apollo people search patterns, API architecture, and GTM sourcing workflows.',
    feedPath: '/feed/apollo-wiki.xml',
  })

  const items = apolloWikiToFeedItems(APOLLO_WIKI_ENTRIES, SITE_URL, '/apollo-wiki')
  return feedResponse(config, items)
}
