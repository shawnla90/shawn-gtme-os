import { feedResponse, getFeedConfig, geoWikiToFeedItems } from '@shawnos/shared/lib'
import { GEO_WIKI_ENTRIES } from '@shawnos/shared/data/geo-wiki'

const SITE_URL = 'https://shawnos.ai'

export function GET() {
  const config = getFeedConfig('shawnos', {
    title: 'shawnos.ai — GEO Wiki',
    description: 'Generative Engine Optimization guides — get cited by AI engines.',
    feedPath: '/feed/geo.xml',
  })
  const items = geoWikiToFeedItems(GEO_WIKI_ENTRIES, SITE_URL)
  return feedResponse(config, items)
}
