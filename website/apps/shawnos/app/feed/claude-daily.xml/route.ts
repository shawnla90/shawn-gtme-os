import path from 'path'
import {
  getAllPosts,
  feedResponse,
  getFeedConfig,
  blogPostsToFeedItems,
} from '@shawnos/shared/lib'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')

export function GET() {
  const config = getFeedConfig('shawnos', {
    title: 'Claude Code Daily | shawnos.ai',
    description:
      'Daily digest of the Claude Code ecosystem. Trending discussions, builder takeaways, and community pulse.',
    feedPath: '/feed/claude-daily.xml',
  })

  const allPosts = getAllPosts(CONTENT_DIR)
  const dailyPosts = allPosts.filter((p) => p.category === 'claude-daily')
  const items = blogPostsToFeedItems(dailyPosts, SITE_URL)

  return feedResponse(config, items)
}
