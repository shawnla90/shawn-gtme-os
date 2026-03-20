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

/* ── section nav ────────────────────────────────────── */

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

/* ── helpers ────────────────────────────────────────── */

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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
      <section
        className="full-bleed"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0a0f14 0%, var(--canvas) 100%)',
          padding: '100px 24px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* background glow */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: `radial-gradient(ellipse, ${GREEN}08 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '720px', width: '100%', textAlign: 'center', position: 'relative' }}>
          <MotionReveal variant="fadeUp" delay={0.1}>
            {/* CC mark */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${GREEN}15, ${GREEN}08)`,
                border: `1px solid ${GREEN}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 28px',
              }}
            >
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: GREEN,
                  letterSpacing: '-2px',
                  lineHeight: 1,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                CC
              </span>
            </div>

            {/* title */}
            <h1
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 700,
                color: '#e6edf3',
                lineHeight: 1.1,
                margin: 0,
                fontFamily: 'var(--font-sans)',
                letterSpacing: '-0.02em',
              }}
            >
              Claude Code{' '}
              <span style={{ color: GREEN }}>Daily</span>
            </h1>

            {/* tagline */}
            <p
              style={{
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: '#8b949e',
                lineHeight: 1.6,
                margin: '16px auto 0',
                maxWidth: '480px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 400,
              }}
            >
              The daily show for Claude Code builders.
              <br />
              News. Repos. Roasts. The comments you missed.
            </p>

            {/* meta row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '28px',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: GREEN,
                  background: `${GREEN}12`,
                  border: `1px solid ${GREEN}30`,
                  borderRadius: '20px',
                  padding: '5px 16px',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Live
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: '#8b949e',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {sorted.length} episodes
              </span>
              <a
                href="/feed/claude-daily.xml"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: GREEN,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                RSS
              </a>
            </div>
          </MotionReveal>
        </div>

        {/* scroll hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#8b949e',
            fontSize: '20px',
            lineHeight: 1,
            userSelect: 'none',
            opacity: 0.5,
          }}
        >
          &#8964;
        </div>
      </section>

      <ScrollRevealSection background="var(--canvas)">
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {sorted.length === 0 ? (
            <div
              style={{
                padding: '48px 32px',
                textAlign: 'center',
                color: '#8b949e',
                fontSize: '15px',
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontFamily: 'var(--font-sans)',
              }}
            >
              No episodes yet. First one drops soon.
            </div>
          ) : (
            <>
              {/* Latest episode */}
              {latest && (
                <div style={{ marginBottom: '56px' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: GREEN,
                      marginBottom: '14px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Latest Episode
                  </div>
                  <Link
                    href={`/blog/${latest.slug}`}
                    style={{
                      padding: '28px',
                      background: 'linear-gradient(135deg, #0d1117, #101820)',
                      border: `1px solid ${GREEN_DIM}`,
                      borderRadius: '12px',
                      textDecoration: 'none',
                      display: 'block',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = GREEN
                      el.style.boxShadow = `0 0 30px ${GREEN}10`
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement
                      el.style.borderColor = GREEN_DIM
                      el.style.boxShadow = 'none'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#e6edf3',
                        lineHeight: 1.3,
                        marginBottom: '10px',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {latest.title}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#8b949e',
                        marginBottom: '16px',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {latest.excerpt}
                    </div>

                    {/* section badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {SECTIONS.map((s) => (
                        <Link
                          key={s.anchor}
                          href={`/blog/${latest.slug}#${s.anchor}`}
                          style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            color: '#8b949e',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            background: '#ffffff06',
                            border: '1px solid #ffffff0a',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                            fontFamily: 'var(--font-sans)',
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.borderColor = `${GREEN}40`
                            el.style.color = GREEN
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLElement
                            el.style.borderColor = '#ffffff0a'
                            el.style.color = '#8b949e'
                          }}
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <time
                        dateTime={latest.date}
                        style={{
                          fontSize: '13px',
                          color: '#6e7681',
                          fontFamily: 'var(--font-sans)',
                        }}
                      >
                        {formatDate(latest.date)}
                      </time>
                      {latest.readingTime !== undefined && (
                        <>
                          <span style={{ fontSize: '13px', color: '#6e7681' }}>&middot;</span>
                          <span
                            style={{
                              fontSize: '13px',
                              color: '#6e7681',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {latest.readingTime} min read
                          </span>
                        </>
                      )}
                      <span
                        style={{
                          fontSize: '13px',
                          color: GREEN,
                          fontWeight: 600,
                          fontFamily: 'var(--font-sans)',
                          marginLeft: 'auto',
                        }}
                      >
                        Read episode &rarr;
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Archive */}
              {archive.length > 0 && (
                <div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#6e7681',
                      marginBottom: '16px',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Previous Episodes
                  </div>
                  <div
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <StaggerContainer stagger={0.04}>
                      {archive.map((post, i) => (
                        <StaggerItem key={post.slug}>
                          <Link
                            href={`/blog/${post.slug}`}
                            style={{
                              padding: '16px 20px',
                              borderBottom: i < archive.length - 1 ? '1px solid var(--border)' : 'none',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '16px',
                              textDecoration: 'none',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = '#ffffff04'
                              const title = el.querySelector('[data-title]') as HTMLElement
                              if (title) title.style.color = GREEN
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement
                              el.style.background = 'transparent'
                              const title = el.querySelector('[data-title]') as HTMLElement
                              if (title) title.style.color = '#e6edf3'
                            }}
                          >
                            <span
                              data-title
                              style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#e6edf3',
                                lineHeight: 1.4,
                                flex: 1,
                                fontFamily: 'var(--font-sans)',
                              }}
                            >
                              {post.title}
                            </span>
                            <time
                              dateTime={post.date}
                              style={{
                                fontSize: '13px',
                                color: '#6e7681',
                                whiteSpace: 'nowrap',
                                fontFamily: 'var(--font-sans)',
                              }}
                            >
                              {formatDate(post.date)}
                            </time>
                          </Link>
                        </StaggerItem>
                      ))}
                    </StaggerContainer>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollRevealSection>
    </>
  )
}
