import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PostsFeed } from './PostsFeed'
import type { PostsData } from './PostsFeed'
import { SITES } from '@shawnos/shared/lib/sites'

const SITE_URL = SITES.contentos
const DATA_DIR = path.join(process.cwd(), '..', '..', '..', 'data', 'linkedin', 'posts')

export const revalidate = 3600

/* -- metadata ----------------------------------------------------- */

export const metadata: Metadata = {
  title: 'Daily LinkedIn Posts | AI-Generated Content with Voice DNA',
  description:
    'Fresh LinkedIn posts generated daily using AI with anti-slop voice validation. Trending topics in AI, GTM, and builder culture - ready to post.',
  keywords: [
    'linkedin posts',
    'ai generated content',
    'linkedin content ideas',
    'gtm content',
    'ai agent posts',
    'content generation',
    'anti-slop content',
    'voice dna',
  ],
  alternates: { canonical: `${SITE_URL}/posts` },
  openGraph: {
    title: 'Daily LinkedIn Posts | theContentOS.ai',
    description:
      'Fresh LinkedIn posts generated daily. AI + voice DNA + anti-slop validation.',
    url: `${SITE_URL}/posts`,
  },
  twitter: {
    title: 'Daily LinkedIn Posts | theContentOS.ai',
    description:
      'Fresh LinkedIn posts generated daily. AI + voice DNA + anti-slop validation.',
  },
}

/* -- data helpers -------------------------------------------------- */

function resolveDataDir(): string {
  // Try multiple paths for monorepo compatibility
  const candidates = [
    path.join(process.cwd(), '..', '..', '..', 'data', 'linkedin', 'posts'),
    path.join(process.cwd(), 'data', 'linkedin', 'posts'),
    path.resolve('/Users/shawnos.ai/shawn-gtme-os/data/linkedin/posts'),
  ]
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir
  }
  return candidates[0]
}

function getAllPostDates(): string[] {
  const dir = resolveDataDir()
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
    .sort()
    .reverse()
}

function getPostsByDate(date: string): PostsData | null {
  const dir = resolveDataDir()
  const filePath = path.join(dir, `${date}.json`)
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as PostsData
  } catch {
    return null
  }
}

function getPostAggregates(dates: string[]): {
  totalPosts: number
  totalDays: number
  avgScore: number
  topSource: string
} {
  let totalPosts = 0
  let totalScore = 0
  let scoreCount = 0
  const authorCounts: Record<string, number> = {}

  for (const date of dates.slice(0, 30)) {
    const data = getPostsByDate(date)
    if (!data) continue

    totalPosts += data.generated_count || data.posts.length
    if (data.avg_anti_slop_score) {
      totalScore += data.avg_anti_slop_score
      scoreCount++
    }

    for (const post of data.posts) {
      const author = post.inspired_by?.author
      if (author) {
        authorCounts[author] = (authorCounts[author] || 0) + 1
      }
    }
  }

  const topSource = Object.entries(authorCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '-'

  return {
    totalPosts,
    totalDays: dates.length,
    avgScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
    topSource,
  }
}

/* -- styles ------------------------------------------------------- */

const pageWrap: React.CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '24px',
}

const heroTitle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.2,
  marginBottom: '12px',
}

const heroDesc: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '24px',
  maxWidth: 640,
}

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  marginBottom: '24px',
  flexWrap: 'wrap',
}

const statBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const statNum: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--accent)',
}

const statLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '32px 0',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const sectionPrompt: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '8px',
}

const navRow: React.CSSProperties = {
  marginTop: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
}

const navLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

const emptyState: React.CSSProperties = {
  padding: '60px 20px',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '14px',
  lineHeight: 1.7,
}

/* -- page component (server) -------------------------------------- */

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const params = await searchParams
  const allDates = getAllPostDates()
  const targetDate = params.date || allDates[0] || ''
  const data = targetDate ? getPostsByDate(targetDate) : null
  const aggregates = getPostAggregates(allDates)

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Daily LinkedIn Posts',
    url: `${SITE_URL}/posts`,
    description:
      'AI-generated LinkedIn posts with voice DNA and anti-slop validation. Trending topics scouted daily.',
    author: { '@type': 'Person', name: 'Shawn Tenam', url: 'https://shawnos.ai' },
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Posts', url: `${SITE_URL}/posts` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cat ~/linkedin/posts/today.json
        </h1>

        {/* Hero */}
        <h2 style={heroTitle}>Daily LinkedIn Posts</h2>
        <p style={heroDesc}>
          AI-generated LinkedIn posts with voice DNA and anti-slop validation.
          Trending topics scouted daily, posts generated with practitioner voice.
          Copy any post with one click.
        </p>

        {/* Stats */}
        <div style={statsRow}>
          <div style={statBox}>
            <span style={statNum}>{data?.generated_count || 0}</span>
            <span style={statLabel}>Posts Today</span>
          </div>
          <div style={statBox}>
            <span style={statNum}>{aggregates.totalPosts}</span>
            <span style={statLabel}>Total Posts</span>
          </div>
          <div style={statBox}>
            <span style={statNum}>{data?.avg_anti_slop_score || aggregates.avgScore}%</span>
            <span style={statLabel}>Avg Anti-Slop</span>
          </div>
          <div style={statBox}>
            <span style={statNum}>{aggregates.totalDays}</span>
            <span style={statLabel}>Days Active</span>
          </div>
        </div>

        <hr style={divider} />

        {/* Feed */}
        <div style={sectionPrompt}>$ ls ~/linkedin/posts/ | sort -r</div>
        <div style={sectionTitle}>
          {targetDate ? `Posts for ${targetDate}` : 'Post Feed'}
        </div>

        {data ? (
          <PostsFeed data={data} availableDates={allDates} />
        ) : (
          <div style={emptyState}>
            <p>No posts generated yet.</p>
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              Posts are generated daily at 9:00 AM via the LinkedIn scout + generator pipeline.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={navRow}>
          <Link href="/" style={navLink}>
            &larr; home
          </Link>
          <Link href="/updates" style={navLink}>
            updates &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
