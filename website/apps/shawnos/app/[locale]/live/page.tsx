import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { hreflang } from '../../../i18n/hreflang'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { fetchSubredditPosts, fetchSubredditInfo } from '@shawnos/shared/lib/reddit'
import aiNewsCache from '@shawnos/shared/data/ai-news-cache.json'
import LiveHero from './LiveHero'
import LiveFeed from './LiveFeed'

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'
const SUBREDDIT = 'GTMBuilders'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Live')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'AI news feed',
      'AI builder news',
      'Claude Code updates',
      'AI agent news',
      'GTM builders community',
      'builder-led growth',
      'AI tools',
      'open source AI',
    ],
    alternates: { canonical: `${SITE_URL}/live`, languages: hreflang('/live') },
    openGraph: {
      title: 'Live Feed | AI News & Builder Community',
      description: 'Curated AI builder news and community posts from r/GTMBuilders.',
      url: `${SITE_URL}/live`,
      images: [
        {
          url: `/og?title=${encodeURIComponent('Live Feed')}&subtitle=${encodeURIComponent('AI News & Builder Community')}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Live Feed | AI News & Builder Community',
      description: 'Curated AI builder news and community posts from r/GTMBuilders.',
      images: [
        `/og?title=${encodeURIComponent('Live Feed')}&subtitle=${encodeURIComponent('AI News & Builder Community')}`,
      ],
    },
  }
}

export default async function LivePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [posts, subInfo] = await Promise.all([
    fetchSubredditPosts(SUBREDDIT, 50),
    fetchSubredditInfo(SUBREDDIT),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newsItems = (aiNewsCache.items || []) as any[]
  const lastUpdated = aiNewsCache.lastUpdated || null

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Live', url: `${SITE_URL}/live` },
        ]}
      />

      <LiveHero
        subscriberCount={subInfo?.subscribers ?? 0}
        postCount={posts.length}
        newsItemCount={newsItems.length}
        lastUpdated={lastUpdated}
      />

      <LiveFeed
        newsItems={newsItems}
        redditPosts={posts}
        subredditName={SUBREDDIT}
      />
    </>
  )
}
