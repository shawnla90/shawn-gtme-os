import { feedResponse, getFeedConfig, howToWikiToFeedItems } from '@shawnos/shared/lib'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'

const SITE_URL = 'https://shawnos.ai'

export function GET() {
  const config = getFeedConfig('shawnos', {
    title: 'shawnos.ai — How-To Wiki',
    description: 'Step-by-step guides for IDE, CLI, MCP, and agent workflows.',
    feedPath: '/feed/how-to.xml',
  })
  const items = howToWikiToFeedItems(HOW_TO_WIKI_ENTRIES, SITE_URL)
  return feedResponse(config, items)
}
