'use client'

import { useMemo } from 'react'
import { ScrollRevealSection, StaggerContainer, StaggerItem, MotionReveal } from '@shawnos/shared/components'
import { Link } from '../../../i18n/navigation'

interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  readingTime?: number
  category?: string
  featured?: boolean
}

/* ── brand ────────────────────────────────────────── */

const GREEN = '#4EC373'
const GREEN_DIM = '#4EC37344'

/* ── block art strings (oh-my-logo --filled --block-font block) ── */

const CLAUDE_ART = `██████╗ ██╗       █████╗  ██╗   ██╗ ██████╗  ███████╗
██╔════╝ ██║      ██╔══██╗ ██║   ██║ ██╔══██╗ ██╔════╝
██║      ██║      ███████║ ██║   ██║ ██║  ██║ █████╗
██║      ██║      ██╔══██║ ██║   ██║ ██║  ██║ ██╔══╝
╚██████╗ ███████╗ ██║  ██║ ╚██████╔╝ ██████╔╝ ███████╗
 ╚═════╝ ╚══════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═════╝  ╚══════╝`

const DAILY_ART = `██████╗   █████╗  ██╗ ██╗      ██╗   ██╗
██╔══██╗ ██╔══██╗ ██║ ██║      ╚██╗ ██╔╝
██║  ██║ ███████║ ██║ ██║       ╚████╔╝
██║  ██║ ██╔══██║ ██║ ██║        ╚██╔╝
██████╔╝ ██║  ██║ ██║ ███████╗    ██║
╚═════╝  ╚═╝  ╚═╝ ╚═╝ ╚══════╝    ╚═╝`

const C_ART = ` ██████╗
██╔════╝
██║
██║
╚██████╗
 ╚═════╝`

/* ── block art text style ─────────────────────────── */

const blockTextBase: React.CSSProperties = {
  fontFamily: 'var(--font-mono), monospace',
  lineHeight: 1.15,
  letterSpacing: '0.02em',
  whiteSpace: 'pre',
  margin: 0,
  padding: 0,
  userSelect: 'none',
}

/* ── styles ────────────────────────────────────────── */

const heroSection: React.CSSProperties = {
  minHeight: '70vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--canvas)',
  padding: '80px 24px 40px',
  position: 'relative',
}

const heroInner: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '48px',
  maxWidth: '1060px',
  width: '100%',
}

const heroLeft: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const heroSubtitle: React.CSSProperties = {
  fontSize: 'clamp(13px, 1.6vw, 16px)',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-mono)',
  lineHeight: 1.6,
  margin: '20px 0 20px',
}

const heroMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

const countBadge: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-mono)',
}

const liveBadge: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  color: GREEN,
  border: `1px solid ${GREEN_DIM}`,
  borderRadius: '10px',
  padding: '3px 10px',
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
}

const rssLink: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: GREEN,
  border: `1px solid ${GREEN_DIM}`,
  borderRadius: '3px',
  padding: '2px 8px',
  textDecoration: 'none',
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.06em',
}

const latestSection: React.CSSProperties = {
  marginBottom: '48px',
}

const latestLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: GREEN,
  fontFamily: 'var(--font-mono)',
  marginBottom: '12px',
}

const latestCard: React.CSSProperties = {
  padding: '24px',
  background: 'var(--canvas-subtle)',
  border: `1px solid ${GREEN_DIM}`,
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'block',
  transition: 'border-color 0.2s ease',
}

const latestTitle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 600,
  color: GREEN,
  lineHeight: 1.3,
  marginBottom: '8px',
}

const latestExcerpt: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
}

const latestMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const metaDate: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-mono)',
}

const readLinkStyle: React.CSSProperties = {
  fontSize: '12px',
  color: GREEN,
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  textDecoration: 'none',
}

const archiveLabel: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-mono)',
  marginBottom: '16px',
}

const archiveItem: React.CSSProperties = {
  padding: '16px 20px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
  textDecoration: 'none',
}

const archiveTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  lineHeight: 1.4,
  flex: 1,
}

const archiveDateStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  fontFamily: 'var(--font-mono)',
  whiteSpace: 'nowrap',
}

const sectionBadge: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '3px 10px',
  fontFamily: 'var(--font-mono)',
  textDecoration: 'none',
  transition: 'all 0.15s ease',
  whiteSpace: 'nowrap',
}

const sectionBadgesWrap: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
  marginTop: '12px',
}

const SECTIONS = [
  { label: 'the pulse', anchor: 'the-pulse' },
  { label: 'hottest thread', anchor: 'hottest-thread' },
  { label: 'repo of the day', anchor: 'repo-of-the-day' },
  { label: 'best comment', anchor: 'best-comment-award' },
  { label: 'troll of the day', anchor: 'troll-of-the-day' },
  { label: 'fun facts', anchor: 'fun-facts' },
  { label: 'code drop', anchor: 'code-drop' },
  { label: 'scoreboard', anchor: 'the-scoreboard' },
]

const emptyState: React.CSSProperties = {
  padding: '48px 32px',
  textAlign: 'center',
  color: 'var(--text-muted)',
  fontSize: '13px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontFamily: 'var(--font-mono)',
}

/* ── component ────────────────────────────────────── */

export function ClaudeDailyContent({ posts }: { posts: Post[] }) {
  const sorted = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts],
  )

  const latest = sorted[0]
  const archive = sorted.slice(1)

  return (
    <>
      {/* Hero */}
      <section className="full-bleed" style={heroSection}>
        <div style={heroInner}>
          <MotionReveal variant="fadeUp" delay={0.1}>
            <div style={heroLeft}>
              {/* CLAUDE in block characters */}
              <pre
                style={{
                  ...blockTextBase,
                  fontSize: 'clamp(6px, 1.15vw, 14px)',
                  color: GREEN,
                  textShadow: `0 0 20px #4EC37330, 0 0 4px #4EC37320`,
                }}
              >
                {CLAUDE_ART}
              </pre>
              {/* DAILY in block characters */}
              <pre
                style={{
                  ...blockTextBase,
                  fontSize: 'clamp(6px, 1.15vw, 14px)',
                  color: GREEN,
                  textShadow: `0 0 20px #4EC37330, 0 0 4px #4EC37320`,
                  marginTop: '-2px',
                }}
              >
                {DAILY_ART}
              </pre>

              <p style={heroSubtitle}>
                the daily show for claude code builders.
                <br />
                news. repos. roasts. the comments you missed.
              </p>
              <div style={heroMeta}>
                <span style={liveBadge}>live</span>
                <span style={countBadge}>{sorted.length} digests</span>
                <a href="/feed/claude-daily.xml" style={rssLink}>
                  RSS
                </a>
              </div>
            </div>
          </MotionReveal>

          {/* CC mascot - two C's, back one angled */}
          <MotionReveal variant="fadeUp" delay={0.3}>
            <div
              className="cc-mascot-wrap"
              style={{
                flexShrink: 0,
                position: 'relative',
                width: 'clamp(160px, 18vw, 240px)',
                height: 'clamp(160px, 18vw, 240px)',
              }}
            >
              {/* Dark circle bg */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: '#161b22',
                  border: '1px solid #4EC37315',
                  boxShadow: '0 0 40px #4EC37310',
                }}
              />
              {/* Top C - upper left */}
              <pre
                style={{
                  ...blockTextBase,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-58%, -62%)',
                  fontSize: 'clamp(12px, 2.2vw, 24px)',
                  color: GREEN,
                  textShadow: `0 0 16px #4EC37340, 0 0 4px #4EC37330`,
                }}
              >
                {C_ART}
              </pre>
              {/* Bottom C - lower right, full opacity */}
              <pre
                style={{
                  ...blockTextBase,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-38%, -38%)',
                  fontSize: 'clamp(12px, 2.2vw, 24px)',
                  color: '#6FD98F',
                  textShadow: `0 0 16px #4EC37340, 0 0 4px #4EC37330`,
                }}
              >
                {C_ART}
              </pre>
            </div>
          </MotionReveal>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--text-muted)',
            fontSize: '24px',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          &#8964;
        </div>
      </section>

      <ScrollRevealSection background="var(--canvas)">
        {sorted.length === 0 ? (
          <div style={emptyState}>
            No digests published yet. First one drops soon.
          </div>
        ) : (
          <>
            {latest && (
              <div style={latestSection}>
                <div style={latestLabel}>Latest</div>
                <Link
                  href={`/blog/${latest.slug}`}
                  style={latestCard}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = GREEN
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = GREEN_DIM
                  }}
                >
                  <div style={latestTitle}>{latest.title}</div>
                  <div style={latestExcerpt}>{latest.excerpt}</div>
                  <div style={sectionBadgesWrap}>
                    {SECTIONS.map((s) => (
                      <Link
                        key={s.anchor}
                        href={`/blog/${latest.slug}#${s.anchor}`}
                        style={sectionBadge}
                        onMouseEnter={(e) => {
                          ;(e.currentTarget as HTMLElement).style.borderColor = GREEN
                          ;(e.currentTarget as HTMLElement).style.color = GREEN
                        }}
                        onMouseLeave={(e) => {
                          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                          ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                        }}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                  <div style={{ ...latestMeta, marginTop: '12px' }}>
                    <time dateTime={latest.date} style={metaDate}>
                      {latest.date}
                    </time>
                    {latest.readingTime !== undefined && (
                      <>
                        <span style={{ ...metaDate, color: 'var(--text-muted)' }}>&middot;</span>
                        <span style={metaDate}>{latest.readingTime} min read</span>
                      </>
                    )}
                    <span style={readLinkStyle}>read &rarr;</span>
                  </div>
                </Link>
              </div>
            )}

            {archive.length > 0 && (
              <div>
                <div style={archiveLabel}>Archive</div>
                <StaggerContainer stagger={0.04}>
                  {archive.map((post) => (
                    <StaggerItem key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        style={archiveItem}
                        onMouseEnter={(e) => {
                          const title = (e.currentTarget as HTMLElement).querySelector(
                            'span',
                          ) as HTMLElement
                          if (title) title.style.color = GREEN
                        }}
                        onMouseLeave={(e) => {
                          const title = (e.currentTarget as HTMLElement).querySelector(
                            'span',
                          ) as HTMLElement
                          if (title) title.style.color = 'var(--text-primary)'
                        }}
                      >
                        <span style={archiveTitle}>{post.title}</span>
                        <time dateTime={post.date} style={archiveDateStyle}>
                          {post.date}
                        </time>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}
          </>
        )}
      </ScrollRevealSection>

      <style>{`
        @media (max-width: 700px) {
          .cc-mascot-wrap { display: none; }
        }
      `}</style>
    </>
  )
}
