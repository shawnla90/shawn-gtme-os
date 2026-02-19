import path from 'path'
import { getAllPosts, feedResponse, getFeedConfig, blogPostsToFeedItems } from '@shawnos/shared/lib'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')

export function GET() {
  const posts = getAllPosts(CONTENT_DIR)
  const config = getFeedConfig('shawnos', {
    title: 'shawnos.ai — Blog',
    description: 'GTM engineering, built in public.',
    feedPath: '/feed.xml',
  })
  const items = blogPostsToFeedItems(posts, SITE_URL)
  return feedResponse(config, items)
}
