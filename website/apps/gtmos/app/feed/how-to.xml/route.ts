import {
  feedResponse,
  getFeedConfig,
  howToWikiToFeedItems,
  SITE_URLS,
} from '@shawnos/shared/lib/rss'
import { getHowToWikiEntriesBySite } from '@shawnos/shared/data/how-to-wiki'

const SITE_URL = SITE_URLS.gtmos

export function GET() {
  const config = getFeedConfig('gtmos', {
    title: 'theGTMOS.ai — How-To Wiki',
    description: 'Step-by-step guides for Clay workflows, GTM engineering, and pipeline automation.',
    feedPath: '/feed/how-to.xml',
  })
  const entries = getHowToWikiEntriesBySite('gtmos')
  const items = howToWikiToFeedItems(entries, SITE_URL)
  return feedResponse(config, items)
}
