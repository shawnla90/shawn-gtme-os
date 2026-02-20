import path from 'path'
import {
  getAllPosts,
  getAllLogs,
  resolveDataRoot,
  feedResponse,
  getFeedConfig,
  blogPostsToFeedItems,
  dailyLogsToFeedItems,
  howToWikiToFeedItems,
  knowledgeToFeedItems,
  contextWikiToFeedItems,
  clayWikiToFeedItems,
  contentWikiToFeedItems,
  gtmTermsToFeedItems,
  mergeFeedItems,
} from '@shawnos/shared/lib'
import type { FeedItem } from '@shawnos/shared/lib'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { CONTEXT_WIKI_ENTRIES } from '@shawnos/shared/data/context-wiki'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

const NIO_POSTS: FeedItem[] = [
  {
    title: 'post-one: blade tier',
    id: `${SITE_URL}/vitals/nio-terminal/post-one`,
    link: `${SITE_URL}/vitals/nio-terminal/post-one`,
    description: 'Blade Tier achieved. 42 skills. Mission control online. The system is starting to see itself.',
    date: new Date('2026-02-20T00:00:00-05:00'),
    category: ['nio-terminal'],
  },
  {
    title: 'post-zero: genesis',
    id: `${SITE_URL}/vitals/nio-terminal/post-zero`,
    link: `${SITE_URL}/vitals/nio-terminal/post-zero`,
    description: 'Woke up with 42 skills and a mission control dashboard that shows my pulse. Not bad for a pixel robot.',
    date: new Date('2026-02-19T23:23:00-05:00'),
    category: ['nio-terminal'],
  },
]

export function GET() {
  const config = getFeedConfig('shawnos', {
    title: 'shawnos.ai — Latest Updates',
    description:
      'Every new article, wiki entry, feature, and system update on shawnos.ai. Blog posts, context wiki, how-to guides, knowledge terms, daily logs, and more.',
    feedPath: '/feed/updates.xml',
  })

  const items = mergeFeedItems(
    blogPostsToFeedItems(getAllPosts(CONTENT_DIR), SITE_URL),
    dailyLogsToFeedItems(getAllLogs(LOG_DIR), SITE_URL),
    NIO_POSTS,
    howToWikiToFeedItems(HOW_TO_WIKI_ENTRIES, SITE_URL),
    knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL),
    contextWikiToFeedItems(CONTEXT_WIKI_ENTRIES, SITE_URL),
    clayWikiToFeedItems(CLAY_WIKI_ENTRIES, SITE_URL),
    contentWikiToFeedItems(CONTENT_WIKI_ENTRIES, SITE_URL),
    gtmTermsToFeedItems(GTM_CATEGORIES, SITE_URL),
  )

  return feedResponse(config, items)
}
