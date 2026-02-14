import type { Metadata } from 'next'
import path from 'path'
import Link from 'next/link'
import { getAllPosts, getAllLogs } from '@shawnos/shared/lib'
import { PostCard, LogCard, TypewriterHero } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'ShawnOS.ai — GTM engineering, built in public',
  description:
    'One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.',
  alternates: { canonical: 'https://shawnos.ai' },
  openGraph: {
    title: 'ShawnOS.ai — GTM engineering, built in public',
    description:
      'One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.',
    url: 'https://shawnos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    title: 'ShawnOS.ai — GTM engineering, built in public',
    description:
      'One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.',
    images: ['/og'],
  },
}

const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

/* ── boot log entries ────────────────────────────── */

const bootLines: { status: string; label: string }[] = [
  { status: 'OK', label: 'content engine ... online' },
  { status: 'OK', label: 'three-site network ... synced' },
  { status: 'OK', label: 'gtm engine ... theGTMOS.ai' },
  { status: 'OK', label: 'content os ... theContentOS.ai' },
  { status: 'OK', label: 'cursor agent ... active' },
  { status: 'OK', label: 'blog pipeline ... mounted' },
  { status: 'OK', label: 'build-in-public mode ... engaged' },
  { status: 'OK', label: 'daily tracker ... streaming' },
]

/* ── styles ──────────────────────────────────────── */

const page: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '48px 20px',
  fontFamily: 'var(--font-mono)',
}

const heroSection: React.CSSProperties = {
  marginBottom: 56,
}

const prompt: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginBottom: 16,
}

const promptChar: React.CSSProperties = {
  color: 'var(--accent)',
}

const heroLoaded: React.CSSProperties = {
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginBottom: 8,
  fontWeight: 400,
}

const ctaRow: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
}

const ctaPrimary: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--canvas)',
  background: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  textDecoration: 'none',
  transition: 'opacity 0.15s ease',
}

const ctaSecondary: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'transparent',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  textDecoration: 'none',
  transition: 'background 0.15s ease, color 0.15s ease',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const section: React.CSSProperties = {
  marginBottom: 56,
}

const bootLine: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 2,
  color: 'var(--text-secondary)',
}

const bootStatus: React.CSSProperties = {
  color: 'var(--accent)',
  fontWeight: 600,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

/* ── page ────────────────────────────────────────── */

export default function HomePage() {
  const posts = getAllPosts(CONTENT_DIR)
  const latestPosts = posts.slice(0, 3)
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return (
    <div style={page}>
      {/* ── Hero ── */}
      <section style={heroSection}>
        <p style={prompt}>
          <span style={promptChar}>$</span> ./boot ShawnOS.ai
        </p>

        <p style={heroLoaded}>&gt; ShawnOS.ai loaded</p>

        <TypewriterHero
          siteName="ShawnOS.ai"
          sequences={[
            {
              text: 'GTM engineering, built in public. One monorepo. One operating system. Every skill, post, and campaign runs through the same codebase.',
              pauseAfter: 3000,
            },
            {
              text: 'S.H.A.W.N. \u2014 Self-Hosted AI Workspace Node',
              color: 'accent',
              pauseAfter: 4000,
            },
          ]}
        />

        <div style={ctaRow}>
          <Link href="/blog" style={ctaPrimary}>
            read the blog &rarr;
          </Link>
          <Link href="/about" style={ctaSecondary}>
            about
          </Link>
        </div>
      </section>

      <hr style={divider} />

      {/* ── Latest Posts ── */}
      {latestPosts.length > 0 && (
        <section style={section}>
          <h2 style={sectionTitle}>
            <span style={promptChar}>$</span>{' '}
            <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
              ls ~/blog --recent -n 3
            </span>
          </h2>

          <div>
            {latestPosts.map((post) => (
              <PostCard
                key={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                slug={post.slug}
              />
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <Link
              href="/blog"
              style={{
                fontSize: '13px',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              view all posts &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* ── Latest Log ── */}
      {latestLog && (
        <>
          <hr style={divider} />

          <section style={section}>
            <h2 style={sectionTitle}>
              <span style={promptChar}>$</span>{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                cat ~/log --latest
              </span>
            </h2>

            <LogCard {...latestLog} basePath="/log" />

            <div style={{ marginTop: 24 }}>
              <Link
                href="/log"
                style={{
                  fontSize: '13px',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                view all logs &rarr;
              </Link>
            </div>
          </section>
        </>
      )}

      <hr style={divider} />

      {/* ── Boot Log ── */}
      <section style={{ ...section, marginBottom: 24 }}>
        <h2 style={sectionTitle}>system status</h2>

        <div
          style={{
            padding: '20px 24px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 6,
          }}
        >
          {bootLines.map((line) => (
            <div key={line.label} style={bootLine}>
              [<span style={bootStatus}>{line.status}</span>] {line.label}
            </div>
          ))}
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--border)',
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            &gt; all systems operational_
          </div>
        </div>
      </section>
    </div>
  )
}
