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
  stream?: string
}

interface Highlights {
  bestComment: string | null
  trollOfTheDay: string | null
  funFacts: string[]
  pulse: string | null
}

const INK = 'var(--text-primary)'
const DIM = 'color-mix(in srgb, var(--text-primary) 27%, transparent)'

const SECTIONS = [
  { label: 'the pulse', anchor: 'the-pulse' },
  { label: 'hottest thread', anchor: 'hottest-thread' },
  { label: 'repo of the day', anchor: 'repo-of-the-day' },
  { label: 'best comment', anchor: 'best-comment-award' },
  { label: 'troll of the day', anchor: 'troll-of-the-day' },
  { label: 'fun facts', anchor: 'fun-facts' },
]

export function ClaudeDailyContent({ posts, highlights }: { posts: Post[]; highlights?: Highlights }) {
  const sorted = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts],
  )

  const active = sorted
  const latest = active[0]
  const archive = active.slice(1)
  const showHighlights =
    highlights && (highlights.bestComment || highlights.trollOfTheDay || highlights.funFacts.length > 0)

  const card: React.CSSProperties = {
    padding: '20px', background: 'var(--canvas-subtle)', border: `1px solid ${DIM}`,
    borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'block',
  }
  const cardLabel: React.CSSProperties = {
    fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    color: INK, marginBottom: '10px', fontFamily: 'var(--font-mono)',
  }
  const quote: React.CSSProperties = {
    fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)',
    borderLeft: `2px solid ${DIM}`, paddingLeft: '12px', fontStyle: 'italic',
  }

  return (
    <>
      <style>{`
        .aura-hero { padding: 72px 24px 12px; }
        .aura-inner { max-width: 960px; margin: 0 auto; display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
        .aura-logo { width: 84px; height: 84px; border-radius: var(--radius-lg); border: 1px solid var(--canvas-border);
          object-fit: cover; flex-shrink: 0; }
        .aura-word { font-size: clamp(34px, 5vw, 54px); font-weight: 700; letter-spacing: -0.03em; line-height: 1;
          color: var(--text-primary); margin: 0 0 10px; }
        .aura-tag { font-size: 15px; color: var(--text-secondary); line-height: 1.55; margin: 0; max-width: 540px; }
        .aura-meta { display: flex; align-items: center; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
        .aura-live { font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--text-primary); border: 1px solid ${DIM}; border-radius: var(--radius-pill); padding: 3px 10px; }
        .aura-count, .aura-rss { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-decoration: none; }
        .aura-rss { border: 1px solid var(--canvas-border); border-radius: var(--radius-pill); padding: 3px 9px; }
      `}</style>

      {/* hero */}
      <section className="full-bleed aura-hero">
        <MotionReveal variant="fadeUp" delay={0.1}>
          <div className="aura-inner">
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 className="aura-word">Claude Code Daily</h1>
              <p className="aura-tag">
                The daily show for Claude Code builders. News, repos, roasts, and the
                Reddit comments you missed. New episode every weekday, weekend edition Saturdays.
              </p>
              <div className="aura-meta">
                <span className="aura-live">live · daily</span>
                <span className="aura-count">{sorted.length} episodes</span>
                <a href="/feed/claude-daily.xml" className="aura-rss">RSS</a>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>

      {/* highlights from the latest episode */}
      {showHighlights && highlights && (
        <section style={{ padding: '24px', maxWidth: '960px', margin: '8px auto 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', alignItems: 'start' }}>
            {highlights.bestComment && (
              <Link href={`/blog/${latest.slug}#best-comment-award`} style={card}>
                <div style={cardLabel}>Best Comment Award</div>
                <div style={quote}>&ldquo;{highlights.bestComment.slice(0, 220)}{highlights.bestComment.length > 220 ? '…' : ''}&rdquo;</div>
              </Link>
            )}
            {highlights.trollOfTheDay && (
              <Link href={`/blog/${latest.slug}#troll-of-the-day`} style={card}>
                <div style={cardLabel}>Troll of the Day</div>
                <div style={quote}>&ldquo;{highlights.trollOfTheDay.slice(0, 220)}{highlights.trollOfTheDay.length > 220 ? '…' : ''}&rdquo;</div>
              </Link>
            )}
            {highlights.funFacts.length > 0 && (
              <Link href={`/blog/${latest.slug}#fun-facts`} style={card}>
                <div style={cardLabel}>Fun Facts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {highlights.funFacts.map((f, i) => (
                    <div key={i} style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                      {f.length > 150 ? f.slice(0, 150) + '…' : f}
                    </div>
                  ))}
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      <ScrollRevealSection background="var(--canvas)">
        {active.length === 0 ? (
          <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px',
            background: 'var(--canvas-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-mono)' }}>
            No episodes yet. The first one drops soon.
          </div>
        ) : (
          <>
            {latest && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ ...cardLabel, color: INK, marginBottom: '12px' }}>Latest</div>
                <Link href={`/blog/${latest.slug}`} style={{ ...card, padding: '24px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 600, color: INK, lineHeight: 1.3, marginBottom: '8px' }}>{latest.title}</div>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '12px' }}>{latest.excerpt}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {SECTIONS.map((s) => (
                      <span key={s.anchor} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-pill)', padding: '3px 10px', fontFamily: 'var(--font-mono)' }}>
                        {s.label}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <time dateTime={latest.date} style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{latest.date}</time>
                    {latest.readingTime !== undefined && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>· {latest.readingTime} min</span>
                    )}
                    <span style={{ fontSize: '12px', color: INK, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>read →</span>
                  </div>
                </Link>
              </div>
            )}

            {archive.length > 0 && (
              <div>
                <div style={{ ...cardLabel, color: 'var(--text-muted)', marginBottom: '16px' }}>Archive</div>
                <StaggerContainer stagger={0.04}>
                  {archive.map((post) => (
                    <StaggerItem key={post.slug}>
                      <Link href={`/blog/${post.slug}`} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1 }}>{post.title}</span>
                        <time dateTime={post.date} style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{post.date}</time>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            )}
          </>
        )}
      </ScrollRevealSection>
    </>
  )
}
