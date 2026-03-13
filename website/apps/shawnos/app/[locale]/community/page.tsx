import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema, RedditFeed } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { fetchSubredditPosts, fetchUserProfile } from '@shawnos/shared/lib/reddit'

export const revalidate = 3600

const SUBREDDIT = 'GTMBuilders'
const REDDIT_USERNAME = 'Shawntenam'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Community - Building in Public',
    description:
      'My contributions to r/GTMBuilders. Workflows, teardowns, and open-source systems - shipped and shared publicly.',
    keywords: [
      'building in public',
      'GTM engineer community',
      'Shawn Tenam Reddit',
      'builder-led growth',
      'GTM workflows',
    ],
    alternates: { canonical: 'https://shawnos.ai/community', languages: hreflang('/community') },
    openGraph: {
      title: 'Community - Building in Public',
      description:
        'My contributions to r/GTMBuilders. Workflows, teardowns, and open-source systems.',
      url: 'https://shawnos.ai/community',
      images: [
        {
          url: '/og?title=Building+in+Public&subtitle=r/GTMBuilders+contributions',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'Community - Building in Public',
      description:
        'My contributions to r/GTMBuilders. Workflows, teardowns, and open-source systems.',
      images: [
        '/og?title=Building+in+Public&subtitle=r/GTMBuilders+contributions',
      ],
    },
  }
}

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const [allPosts, profile] = await Promise.all([
    fetchSubredditPosts(SUBREDDIT, 50),
    fetchUserProfile(REDDIT_USERNAME),
  ])
  const myPosts = allPosts.filter(
    (p) => p.author.toLowerCase() === REDDIT_USERNAME.toLowerCase(),
  )

  const totalComments = myPosts.reduce((sum, p) => sum + p.numComments, 0)

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Community', url: 'https://shawnos.ai/community' }]}
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
          Building in Public
        </div>
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            margin: '0 0 12px',
            lineHeight: 1.1,
          }}
        >
          My r/{SUBREDDIT} Posts
        </h1>
        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: 560,
            margin: '0 auto 32px',
            lineHeight: 1.5,
          }}
        >
          Workflows, teardowns, and open-source systems I share with the
          GTM Builders community.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
            marginBottom: 12,
          }}
        >
          {profile && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80' }}>
                {profile.totalKarma.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Reddit Karma
              </div>
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80' }}>
              {myPosts.length}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Posts
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4ADE80' }}>
              {totalComments}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Comments
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <RedditFeed posts={myPosts} subredditName={SUBREDDIT} />
      </section>

      {/* CTA */}
      <section
        style={{
          padding: '48px 24px 80px',
          maxWidth: 960,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <a
          href="https://thegtmos.ai/community"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: 8,
            border: '1px solid rgba(74,222,128,0.3)',
            background: 'transparent',
            color: '#4ADE80',
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          See the full community &rarr;
        </a>
        <div style={{ marginTop: 16 }}>
          <a
            href={`https://reddit.com/r/${SUBREDDIT}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              textDecoration: 'none',
            }}
          >
            Join r/{SUBREDDIT} on Reddit
          </a>
        </div>
      </section>
    </>
  )
}
