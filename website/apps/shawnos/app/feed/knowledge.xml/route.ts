import { feedResponse, getFeedConfig, knowledgeToFeedItems } from '@shawnos/shared/lib'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'

const SITE_URL = 'https://shawnos.ai'

export function GET() {
  const config = getFeedConfig('shawnos', {
    title: 'shawnos.ai — Engineering Knowledge',
    description: 'Engineering and AI terminology knowledge base.',
    feedPath: '/feed/knowledge.xml',
  })
  const items = knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL)
  return feedResponse(config, items)
}
