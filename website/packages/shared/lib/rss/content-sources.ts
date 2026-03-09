import type { FeedItem } from './types'
import type { Post } from '../posts'
import type { DailyLogSummary } from '../logs'
import type { ClayWikiEntry } from '../../data/clay-wiki'
import type { ContentWikiEntry } from '../../data/content-wiki'
import type { ContextWikiEntry } from '../../data/context-wiki'
import type { HowToWikiEntry } from '../../data/how-to-wiki'
import type { KnowledgeCategory } from '../../data/engineering-terms'
import type { GTMCategory } from '../../data/gtm-terms'

const BUILD_DATE = new Date()

/* ── Blog posts (have real dates) ──────────────────────────────────── */

export function blogPostsToFeedItems(
  posts: Post[],
  siteUrl: string,
): FeedItem[] {
  return posts.map((post) => ({
    title: post.title,
    id: `${siteUrl}/blog/${post.slug}`,
    link: `${siteUrl}/blog/${post.slug}`,
    description: post.excerpt,
    date: new Date(post.date),
    category: ['blog'],
  }))
}

/* ── Daily logs (have real dates) ──────────────────────────────────── */

export function dailyLogsToFeedItems(
  logs: DailyLogSummary[],
  siteUrl: string,
): FeedItem[] {
  return logs.map((log) => ({
    title: `Daily Log — ${log.date}`,
    id: `${siteUrl}/log/${log.date}`,
    link: `${siteUrl}/log/${log.date}`,
    description: [
      `Grade: ${log.letter_grade}`,
      `Score: ${log.output_score}`,
      `${log.accomplishment_count} accomplishments`,
      `${log.words_today} words`,
      `${log.commits_today} commits`,
    ].join(' | '),
    date: new Date(log.date),
    category: ['daily-log'],
  }))
}

/* ── Wiki entries (no dates — use build timestamp) ─────────────────── */

function wikiDescription(entry: {
  subtitle: string
  description: string
}): string {
  return entry.description || entry.subtitle
}

export function clayWikiToFeedItems(
  entries: ClayWikiEntry[],
  siteUrl: string,
  basePath = '/clay-wiki',
): FeedItem[] {
  return entries.map((entry) => ({
    title: entry.title,
    id: `${siteUrl}${basePath}/${entry.id}`,
    link: `${siteUrl}${basePath}/${entry.id}`,
    description: wikiDescription(entry),
    date: BUILD_DATE,
    category: ['clay-wiki', entry.category],
  }))
}

export function contentWikiToFeedItems(
  entries: ContentWikiEntry[],
  siteUrl: string,
  basePath = '/content-wiki',
): FeedItem[] {
  return entries.map((entry) => ({
    title: entry.title,
    id: `${siteUrl}${basePath}/${entry.id}`,
    link: `${siteUrl}${basePath}/${entry.id}`,
    description: wikiDescription(entry),
    date: BUILD_DATE,
    category: ['content-wiki', entry.category],
  }))
}

export function contextWikiToFeedItems(
  entries: ContextWikiEntry[],
  siteUrl: string,
  basePath = '/context-wiki',
): FeedItem[] {
  return entries.map((entry) => ({
    title: entry.title,
    id: `${siteUrl}${basePath}/${entry.id}`,
    link: `${siteUrl}${basePath}/${entry.id}`,
    description: wikiDescription(entry),
    date: BUILD_DATE,
    category: ['context-wiki', entry.category],
  }))
}

export function howToWikiToFeedItems(
  entries: HowToWikiEntry[],
  siteUrl: string,
  basePath = '/how-to',
): FeedItem[] {
  return entries.map((entry) => ({
    title: entry.title,
    id: `${siteUrl}${basePath}/${entry.id}`,
    link: `${siteUrl}${basePath}/${entry.id}`,
    description: wikiDescription(entry),
    date: BUILD_DATE,
    category: ['how-to', entry.category],
  }))
}

/* ── Knowledge terms (nested categories — flatten) ─────────────────── */

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function knowledgeToFeedItems(
  categories: KnowledgeCategory[],
  siteUrl: string,
  basePath = '/knowledge',
): FeedItem[] {
  const items: FeedItem[] = []
  for (const category of categories) {
    for (const term of category.terms) {
      const slug = toSlug(term.name)
      items.push({
        title: term.name,
        id: `${siteUrl}${basePath}#${slug}`,
        link: `${siteUrl}${basePath}#${slug}`,
        description: term.definition,
        date: BUILD_DATE,
        category: ['knowledge', category.name],
      })
    }
  }
  return items
}

export function gtmTermsToFeedItems(
  categories: GTMCategory[],
  siteUrl: string,
  basePath = '/gtm-knowledge',
): FeedItem[] {
  const items: FeedItem[] = []
  for (const category of categories) {
    for (const term of category.terms) {
      items.push({
        title: term.name,
        id: `${siteUrl}${basePath}#${term.id}`,
        link: `${siteUrl}${basePath}#${term.id}`,
        description: term.definition,
        date: BUILD_DATE,
        category: ['gtm-knowledge', category.name],
      })
    }
  }
  return items
}

/* ── Merge + deduplicate utility ───────────────────────────────────── */

/**
 * Merge multiple FeedItem arrays, deduplicate by `id`,
 * and sort by date descending.
 */
export function mergeFeedItems(...sources: FeedItem[][]): FeedItem[] {
  const seen = new Set<string>()
  const merged: FeedItem[] = []

  for (const items of sources) {
    for (const item of items) {
      if (!seen.has(item.id)) {
        seen.add(item.id)
        merged.push(item)
      }
    }
  }

  return merged.sort((a, b) => b.date.getTime() - a.date.getTime())
}
