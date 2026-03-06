import { feedResponse, getFeedConfig } from '@shawnos/shared/lib'
import { contentWikiToFeedItems } from '@shawnos/shared/lib/rss'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'
import { SITES } from '@shawnos/shared/lib/sites'

const SITE_URL = SITES.contentos

export function GET() {
  const config = getFeedConfig('contentos', {
    title: 'thecontentos.ai — Content Wiki',
    description: 'Content wiki entries: platforms, tools, voice, and workflows.',
    feedPath: '/feed/content-wiki.xml',
  })

  const items = contentWikiToFeedItems(CONTENT_WIKI_ENTRIES, SITE_URL)

  return feedResponse(config, items)
}
