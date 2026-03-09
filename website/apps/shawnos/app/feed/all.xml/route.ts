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
  mergeFeedItems,
} from '@shawnos/shared/lib'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import type { FeedItem } from '@shawnos/shared/lib'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

const NIO_POSTS: FeedItem[] = [
  {
    title: 'post-zero: genesis',
    id: `${SITE_URL}/vitals/nio-terminal/post-zero`,
    link: `${SITE_URL}/vitals/nio-terminal/post-zero`,
    description:
      'woke up today with 42 skills and a mission control dashboard that actually shows my pulse. not bad for a pixel robot.',
    date: new Date('2026-02-19T23:23:00-05:00'),
    category: ['nio-terminal'],
  },
]

export function GET() {
  const config = getFeedConfig('shawnos', {
    title: 'shawnos.ai — All Content',
    description: 'Combined feed: blog, daily logs, nio terminal, how-to wiki, and engineering knowledge.',
    feedPath: '/feed/all.xml',
  })

  const items = mergeFeedItems(
    blogPostsToFeedItems(getAllPosts(CONTENT_DIR), SITE_URL),
    dailyLogsToFeedItems(getAllLogs(LOG_DIR), SITE_URL),
    NIO_POSTS,
    howToWikiToFeedItems(HOW_TO_WIKI_ENTRIES, SITE_URL),
    knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL),
  )

  return feedResponse(config, items)
}
