import { createHash } from 'crypto'
import { Feed } from 'feed'
import type { FeedConfig, FeedItem } from './types'

/**
 * Build an RSS 2.0 XML string from a config and array of items.
 * Items should already be sorted by date descending.
 */
export function buildFeed(config: FeedConfig, items: FeedItem[]): string {
  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: config.id,
    link: config.link,
    language: config.language ?? 'en',
    copyright: config.copyright,
    feedLinks: config.feedLinks,
    author: config.author,
    updated: items.length > 0 ? items[0].date : new Date(),
  })

  for (const item of items) {
    feed.addItem({
      title: item.title,
      id: item.id,
      link: item.link,
      description: item.description,
      content: item.content,
      date: item.date,
      category: item.category?.map((name) => ({ name })),
      author: item.author
        ? [item.author]
        : config.author
          ? [config.author]
          : undefined,
    })
  }

  return feed.rss2()
}

export function generateETag(xml: string): string {
  return `"${createHash('md5').update(xml).digest('hex').slice(0, 16)}"`
}

/**
 * Convenience wrapper: builds feed XML and returns a Response
 * with correct Content-Type, Cache-Control, and ETag headers.
 */
export function feedResponse(config: FeedConfig, items: FeedItem[]): Response {
  const xml = buildFeed(config, items)
  const etag = generateETag(xml)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      ETag: etag,
    },
  })
}
