import {
  feedResponse,
  getFeedConfig,
  knowledgeToFeedItems,
  gtmTermsToFeedItems,
  mergeFeedItems,
  SITE_URLS,
} from '@shawnos/shared/lib/rss'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'

const SITE_URL = SITE_URLS.gtmos

export function GET() {
  const config = getFeedConfig('gtmos', {
    title: 'theGTMOS.ai — Knowledge',
    description: 'Engineering and GTM terminology reference.',
    feedPath: '/feed/knowledge.xml',
  })

  const items = mergeFeedItems(
    knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL, '/knowledge'),
    gtmTermsToFeedItems(GTM_CATEGORIES, SITE_URL, '/knowledge/gtm'),
  )

  return feedResponse(config, items)
}
