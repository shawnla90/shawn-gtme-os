import fs from 'fs'
import path from 'path'
import { getAllPosts, type Post } from './posts'
import { resolveDataRoot } from './dataRoot'

export type TimelineSource = 'blog' | 'substack' | 'reddit' | 'linkedin' | 'newsletter'

export interface TimelineAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TimelineBadge {
  label: string
  source: TimelineSource
}

export interface TimelineMeta {
  readingTime?: number
  karma?: number
  comments?: number
  subreddit?: string
}

export interface TimelineItem {
  id: string
  source: TimelineSource
  timestamp: string
  author: TimelineAuthor
  title: string
  body: string
  href: string
  isExternal: boolean
  badge: TimelineBadge
  meta?: TimelineMeta
  pinned?: boolean
  isFresh?: boolean
  /** blog post category (e.g. 'ships', 'gtm-engineering'); undefined for substack/reddit */
  category?: string
}

const SHAWN_AUTHOR: TimelineAuthor = {
  name: 'Shawn Tenam',
  handle: '@shawntenam',
  avatar: '/avatars/shawn.jpg',
}

function hoursSince(input: string | number | Date): number {
  const t = typeof input === 'number' ? input : new Date(input).getTime()
  if (!Number.isFinite(t)) return Number.POSITIVE_INFINITY
  return (Date.now() - t) / (1000 * 60 * 60)
}

function readJsonSafe<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function blogPostsToTimelineItems(
  posts: Post[],
  blogHrefBase = '/blog',
): TimelineItem[] {
  return posts
    .filter((p) => p.date)
    .map((p) => {
      const ts = new Date(p.date).toISOString()
      // Level Up GTM issues are the newsletter, not regular blog posts
      const isNewsletter = p.category === 'level-up-gtm'
      const source = (isNewsletter ? 'newsletter' : 'blog') as TimelineSource
      return {
        id: `blog:${p.slug}`,
        source,
        timestamp: ts,
        author: SHAWN_AUTHOR,
        title: p.title,
        body: p.excerpt,
        href: `${blogHrefBase}/${p.slug}`,
        isExternal: false,
        badge: {
          label: isNewsletter ? 'level up gtm' : p.category ? `blog · ${p.category}` : 'blog',
          source,
        },
        category: p.category,
        meta: { readingTime: p.readingTime },
        isFresh: hoursSince(p.date) < 24,
      }
    })
}

interface SubstackCacheItem {
  guid: string
  title: string
  excerpt: string
  url: string
  pubDate: string
}

interface SubstackCache {
  items: SubstackCacheItem[]
}

export function readSubstackTimelineItems(dataRoot?: string): TimelineItem[] {
  const root = dataRoot ?? resolveDataRoot()
  const cachePath = path.join(root, 'substack', 'feed.json')
  const cache = readJsonSafe<SubstackCache>(cachePath, { items: [] })
  return cache.items
    .filter((i) => i.pubDate)
    .map((i) => ({
      id: `substack:${i.guid}`,
      source: 'substack' as const,
      timestamp: new Date(i.pubDate).toISOString(),
      author: SHAWN_AUTHOR,
      title: i.title,
      body: i.excerpt,
      href: i.url,
      isExternal: true,
      badge: { label: 'substack', source: 'substack' as const },
      isFresh: hoursSince(i.pubDate) < 24,
    }))
}

interface RedditCacheItem {
  id: string
  title: string
  selftext: string
  permalink: string
  subreddit: string
  score: number
  numComments: number
  createdUtc: number
}

interface RedditCache {
  items: RedditCacheItem[]
}

export function readRedditSelfTimelineItems(dataRoot?: string): TimelineItem[] {
  const root = dataRoot ?? resolveDataRoot()
  const cachePath = path.join(root, 'reddit', 'self-posts.json')
  const cache = readJsonSafe<RedditCache>(cachePath, { items: [] })
  return cache.items
    .filter((p) => Number.isFinite(p.createdUtc))
    .map((p) => {
      const tsMs = p.createdUtc * 1000
      return {
        id: `reddit:${p.id}`,
        source: 'reddit' as const,
        timestamp: new Date(tsMs).toISOString(),
        author: SHAWN_AUTHOR,
        title: p.title,
        body: (p.selftext || '').slice(0, 280),
        href: `https://reddit.com${p.permalink}`,
        isExternal: true,
        badge: { label: `r/${p.subreddit}`, source: 'reddit' as const },
        meta: {
          karma: p.score,
          comments: p.numComments,
          subreddit: p.subreddit,
        },
        isFresh: hoursSince(tsMs) < 24,
      }
    })
}

interface LinkedInCacheItem {
  id: string
  title: string
  excerpt: string
  url: string
  postedAt: string
  likes?: number
  comments?: number
}

interface LinkedInCache {
  items: LinkedInCacheItem[]
}

/** Shawn's actually-posted LinkedIn posts (not drafts). Populated by a
 * profile-activity scrape into data/linkedin/self-posts.json; empty until
 * that cache exists. */
export function readLinkedInSelfTimelineItems(dataRoot?: string): TimelineItem[] {
  const root = dataRoot ?? resolveDataRoot()
  const cachePath = path.join(root, 'linkedin', 'self-posts.json')
  const cache = readJsonSafe<LinkedInCache>(cachePath, { items: [] })
  return cache.items
    .filter((i) => i.postedAt)
    .map((i) => ({
      id: `linkedin:${i.id}`,
      source: 'linkedin' as const,
      timestamp: new Date(i.postedAt).toISOString(),
      author: SHAWN_AUTHOR,
      title: i.title,
      body: i.excerpt,
      href: i.url,
      isExternal: true,
      badge: { label: 'linkedin', source: 'linkedin' as const },
      meta: { karma: i.likes, comments: i.comments },
      isFresh: hoursSince(i.postedAt) < 24,
    }))
}

export interface GetTimelineItemsOptions {
  contentDir: string
  blogHrefBase?: string
  source?: TimelineSource
  limit?: number
  /** Blog categories to drop from the feed (e.g. ['claude-daily']). Opt-in — default keeps every post, so other sites are unaffected. */
  excludeCategories?: string[]
}

export function getTimelineItems(opts: GetTimelineItemsOptions): TimelineItem[] {
  const { contentDir, blogHrefBase, source, limit, excludeCategories } = opts
  let posts = getAllPosts(contentDir)
  if (excludeCategories?.length) {
    posts = posts.filter((p) => !excludeCategories.includes(p.category ?? ''))
  }
  const blog = blogPostsToTimelineItems(posts, blogHrefBase)
  const substack = readSubstackTimelineItems()
  const reddit = readRedditSelfTimelineItems()
  const linkedin = readLinkedInSelfTimelineItems()

  let items: TimelineItem[] = [...blog, ...substack, ...reddit, ...linkedin].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  if (source) items = items.filter((i) => i.source === source)
  if (limit) items = items.slice(0, limit)
  return items
}

export function timelineCountsBySource(
  items: TimelineItem[],
): Record<TimelineSource | 'all', number> {
  const counts: Record<TimelineSource | 'all', number> = {
    all: items.length,
    blog: 0,
    substack: 0,
    reddit: 0,
    linkedin: 0,
    newsletter: 0,
  }
  for (const i of items) counts[i.source]++
  return counts
}
