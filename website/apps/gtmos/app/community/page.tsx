import type { Metadata } from 'next'
import { BreadcrumbSchema, RedditFeed } from '@shawnos/shared/components'
import { fetchSubredditPosts, fetchSubredditInfo } from '@shawnos/shared/lib/reddit'

export const revalidate = 3600

const SUBREDDIT = 'GTMBuilders'

export const metadata: Metadata = {
  title: 'GTM Builders Community',
  description:
    'The builder-led growth community. Real GTM engineers sharing workflows, teardowns, and open-source systems - not theory.',
  keywords: [
    'GTM engineer community',
    'builder-led growth community',
    'go-to-market builders',
    'GTM workflows',
    'revenue engineering community',
    'Clay workflows community',
  ],
  alternates: { canonical: 'https://thegtmos.ai/community' },
  openGraph: {
    title: 'GTM Builders Community',
    description:
      'The builder-led growth community. Real workflows, teardowns, and open-source systems.',
    url: 'https://thegtmos.ai/community',
    images: [
      {
        url: '/og?title=GTM+Builders&subtitle=Builder-Led+Growth+Community',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'GTM Builders Community',
    description:
      'The builder-led growth community. Real workflows, teardowns, and open-source systems.',
    images: ['/og?title=GTM+Builders&subtitle=Builder-Led+Growth+Community'],
  },
}

export default async function CommunityPage() {
  const [posts, subInfo] = await Promise.all([
    fetchSubredditPosts(SUBREDDIT, 25),
    fetchSubredditInfo(SUBREDDIT),
  ])

  const totalKarma = posts.reduce((sum, p) => sum + p.score, 0)
  const totalComments = posts.reduce((sum, p) => sum + p.numComments, 0)

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Community', url: 'https://thegtmos.ai/community' }]}
      />

      {/* Hero */}
      <section
        style={{
          padding: '80px 24px 48px',
          maxWidth: 960,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: 20,
            background: 'rgba(74,222,128,0.12)',
            color: '#4ADE80',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          r/{SUBREDDIT}
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}
        >
          GTM Builders
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: 560,
            margin: '0 auto 32px',
            lineHeight: 1.5,
          }}
        >
          Builder-led growth starts here. Real workflows, teardowns, and
          open-source systems from engineers who ship.
        </p>

        {/* Stats strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          {subInfo && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80' }}>
                {subInfo.subscribers}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                Members
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80' }}>
              {posts.length}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Posts
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80' }}>
              {totalKarma}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Karma
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80' }}>
              {totalComments}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Comments
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <RedditFeed posts={posts} subredditName={SUBREDDIT} />
      </section>

      {/* Join CTA */}
      <section
        style={{
          padding: '48px 24px 80px',
          maxWidth: 960,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <a
          href={`https://reddit.com/r/${SUBREDDIT}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: 8,
            background: '#4ADE80',
            color: '#000',
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          Join r/{SUBREDDIT} on Reddit
        </a>
        <div style={{ marginTop: 16 }}>
          <a
            href="https://shawnos.ai/community"
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
            }}
          >
            Built by Shawn Tenam &rarr;
          </a>
        </div>
      </section>
    </>
  )
}
