import { createHash } from 'crypto'
import { Feed } from 'feed'
import type { FeedConfig, FeedItem } from './types'

const CACHE_CONTROL = 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'

/**
 * Construct and populate a Feed object from a config and array of items.
 * Shared by all format-specific builders.
 */
function buildFeedObject(config: FeedConfig, items: FeedItem[]): Feed {
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

  return feed
}

/**
 * Build an RSS 2.0 XML string from a config and array of items.
 * Items should already be sorted by date descending.
 */
export function buildFeed(config: FeedConfig, items: FeedItem[]): string {
  return buildFeedObject(config, items).rss2()
}

export function generateETag(content: string): string {
  return `"${createHash('md5').update(content).digest('hex').slice(0, 16)}"`
}

/**
 * Convenience wrapper: builds RSS 2.0 feed XML and returns a Response
 * with correct Content-Type, Cache-Control, and ETag headers.
 */
export function feedResponse(config: FeedConfig, items: FeedItem[]): Response {
  const xml = buildFeed(config, items)
  const etag = generateETag(xml)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': CACHE_CONTROL,
      ETag: etag,
    },
  })
}

/**
 * Builds Atom 1.0 feed and returns Response with correct headers.
 */
export function atomFeedResponse(config: FeedConfig, items: FeedItem[]): Response {
  const feed = buildFeedObject(config, items)
  const xml = feed.atom1()
  const etag = generateETag(xml)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': CACHE_CONTROL,
      ETag: etag,
    },
  })
}

/**
 * Builds JSON Feed 1.1 and returns Response with correct headers.
 */
export function jsonFeedResponse(config: FeedConfig, items: FeedItem[]): Response {
  const feed = buildFeedObject(config, items)
  const json = feed.json1()
  const etag = generateETag(json)

  return new Response(json, {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': CACHE_CONTROL,
      ETag: etag,
    },
  })
}
