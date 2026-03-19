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
const GREEN_LIGHT = '#6FD98F'
const GREEN_DARK = '#3A9A5A'
const GREEN_BORDER = '#2D7A47'
const GREEN_DIM = '#4EC37344'
const GREEN_GLOW = '#4EC37320'

/* ══════════════════════════════════════════════════════
   BLOCK ART DATA — generated via oh-my-logo (block font)
   Each entry: [col, row] coordinates of filled cells
   ══════════════════════════════════════════════════════ */

// "CLAUDE" — 54 cols × 6 rows
const CLAUDE_COORDS: [number, number][] = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[8,0],[9,0],[10,0],[18,0],[19,0],[20,0],[21,0],[22,0],[23,0],[26,0],[27,0],[28,0],[32,0],[33,0],[34,0],[36,0],[37,0],[38,0],[39,0],[40,0],[41,0],[42,0],[45,0],[46,0],[47,0],[48,0],[49,0],[50,0],[51,0],[52,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[9,1],[10,1],[11,1],[18,1],[19,1],[20,1],[21,1],[22,1],[23,1],[24,1],[25,1],[27,1],[28,1],[29,1],[33,1],[34,1],[35,1],[37,1],[38,1],[39,1],[40,1],[41,1],[42,1],[43,1],[44,1],[46,1],[47,1],[48,1],[49,1],[50,1],[51,1],[52,1],[53,1],[0,2],[1,2],[2,2],[9,2],[10,2],[11,2],[18,2],[19,2],[20,2],[21,2],[22,2],[23,2],[24,2],[25,2],[27,2],[28,2],[29,2],[33,2],[34,2],[35,2],[37,2],[38,2],[39,2],[42,2],[43,2],[44,2],[46,2],[47,2],[48,2],[49,2],[50,2],[51,2],[0,3],[1,3],[2,3],[9,3],[10,3],[11,3],[18,3],[19,3],[20,3],[21,3],[22,3],[23,3],[24,3],[25,3],[27,3],[28,3],[29,3],[33,3],[34,3],[35,3],[37,3],[38,3],[39,3],[42,3],[43,3],[44,3],[46,3],[47,3],[48,3],[49,3],[50,3],[51,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[9,4],[10,4],[11,4],[12,4],[13,4],[14,4],[15,4],[16,4],[18,4],[19,4],[20,4],[23,4],[24,4],[25,4],[27,4],[28,4],[29,4],[30,4],[31,4],[32,4],[33,4],[34,4],[35,4],[37,4],[38,4],[39,4],[40,4],[41,4],[42,4],[43,4],[44,4],[46,4],[47,4],[48,4],[49,4],[50,4],[51,4],[52,4],[53,4],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[9,5],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],[16,5],[18,5],[19,5],[20,5],[23,5],[24,5],[25,5],[28,5],[29,5],[30,5],[31,5],[32,5],[33,5],[34,5],[37,5],[38,5],[39,5],[40,5],[41,5],[42,5],[43,5],[46,5],[47,5],[48,5],[49,5],[50,5],[51,5],[52,5],[53,5]]
const CLAUDE_COLS = 54
const CLAUDE_ROWS = 6

// "DAILY" — 40 cols × 6 rows
const DAILY_COORDS: [number, number][] = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[18,0],[19,0],[20,0],[22,0],[23,0],[24,0],[31,0],[32,0],[33,0],[37,0],[38,0],[39,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[18,1],[19,1],[20,1],[22,1],[23,1],[24,1],[31,1],[32,1],[33,1],[34,1],[36,1],[37,1],[38,1],[39,1],[0,2],[1,2],[2,2],[5,2],[6,2],[7,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],[16,2],[18,2],[19,2],[20,2],[22,2],[23,2],[24,2],[32,2],[33,2],[34,2],[35,2],[36,2],[37,2],[38,2],[0,3],[1,3],[2,3],[5,3],[6,3],[7,3],[9,3],[10,3],[11,3],[12,3],[13,3],[14,3],[15,3],[16,3],[18,3],[19,3],[20,3],[22,3],[23,3],[24,3],[33,3],[34,3],[35,3],[36,3],[37,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[9,4],[10,4],[11,4],[14,4],[15,4],[16,4],[18,4],[19,4],[20,4],[22,4],[23,4],[24,4],[25,4],[26,4],[27,4],[28,4],[29,4],[34,4],[35,4],[36,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[9,5],[10,5],[11,5],[14,5],[15,5],[16,5],[18,5],[19,5],[20,5],[22,5],[23,5],[24,5],[25,5],[26,5],[27,5],[28,5],[29,5],[34,5],[35,5],[36,5]]
const DAILY_COLS = 40
const DAILY_ROWS = 6

// Overlapping CC — back C, overlapping tiles, front C (offset by 5 cols)
const CC_BACK: [number, number][] = [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[3,0],[3,1],[3,4],[3,5],[4,0],[4,1],[4,4],[4,5],[5,5]]
const CC_OVERLAP: [number, number][] = [[5,0],[5,1],[5,4],[6,0],[6,1],[6,4],[6,5],[7,1],[7,4],[7,5]]
const CC_FRONT: [number, number][] = [[5,2],[5,3],[6,2],[6,3],[7,0],[7,2],[7,3],[8,0],[8,1],[8,4],[8,5],[9,0],[9,1],[9,4],[9,5],[10,0],[10,1],[10,4],[10,5],[11,0],[11,1],[11,4],[11,5],[12,1],[12,4],[12,5]]
const CC_COLS = 13
const CC_ROWS = 6

/* ── block art SVG renderer ───────────────────────── */

function BlockArt({
  coords,
  cols,
  rows,
  cellSize = 8,
  gap = 1.5,
  gradientId,
  className,
  style,
}: {
  coords: [number, number][]
  cols: number
  rows: number
  cellSize?: number
  gap?: number
  gradientId?: string
  className?: string
  style?: React.CSSProperties
}) {
  const pitch = cellSize + gap
  const svgW = cols * pitch
  const svgH = rows * pitch
  const pad = 4

  const fill = gradientId ? `url(#${gradientId})` : GREEN

  return (
    <svg
      viewBox={`${-pad} ${-pad} ${svgW + pad * 2} ${svgH + pad * 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        {gradientId && (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={GREEN_LIGHT} />
            <stop offset="50%" stopColor={GREEN} />
            <stop offset="100%" stopColor={GREEN_DARK} />
          </linearGradient>
        )}
        <filter id={`glow-${gradientId || 'default'}`} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      {/* Glow layer */}
      <g filter={`url(#glow-${gradientId || 'default'})`} opacity="0.25">
        {coords.map(([c, r], i) => (
          <rect key={`g${i}`} x={c * pitch} y={r * pitch} width={cellSize} height={cellSize} fill={fill} rx={1.5} />
        ))}
      </g>

      {/* Sharp tiles */}
      <g>
        {coords.map(([c, r], i) => (
          <rect key={`t${i}`} x={c * pitch} y={r * pitch} width={cellSize} height={cellSize} fill={fill} stroke={GREEN_BORDER} strokeWidth={0.15} rx={1.5} />
        ))}
      </g>
    </svg>
  )
}

/* ── CC mascot icon with overlapping C's ──────────── */

function CCMascot() {
  const cell = 20
  const gap = 2
  const pitch = cell + gap
  const svgW = CC_COLS * pitch
  const svgH = CC_ROWS * pitch
  const pad = 40

  return (
    <svg
      width={svgW + pad * 2}
      height={svgH + pad * 2}
      viewBox={`${-pad} ${-pad} ${svgW + pad * 2} ${svgH + pad * 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Dark circle background */}
      <circle cx={svgW / 2} cy={svgH / 2} r={Math.max(svgW, svgH) / 2 + 24} fill="#161b22" />
      <circle cx={svgW / 2} cy={svgH / 2} r={Math.max(svgW, svgH) / 2 + 24} fill="none" stroke={GREEN_GLOW} strokeWidth={3} />

      <defs>
        <linearGradient id="cc-back-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GREEN} />
          <stop offset="100%" stopColor={GREEN_DARK} />
        </linearGradient>
        <linearGradient id="cc-front-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={GREEN_LIGHT} />
          <stop offset="100%" stopColor={GREEN} />
        </linearGradient>
        <filter id="cc-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>

      {/* Glow layer */}
      <g filter="url(#cc-glow)" opacity="0.3">
        {[...CC_BACK, ...CC_OVERLAP, ...CC_FRONT].map(([c, r], i) => (
          <rect key={`gg${i}`} x={c * pitch} y={r * pitch} width={cell} height={cell} fill={GREEN} rx={2} />
        ))}
      </g>

      {/* Back C (darker shade, full opacity for solidity) */}
      <g>
        {CC_BACK.map(([c, r], i) => (
          <rect key={`cb${i}`} x={c * pitch} y={r * pitch} width={cell} height={cell} fill="url(#cc-back-grad)" stroke={GREEN_BORDER} strokeWidth={0.2} rx={2} />
        ))}
      </g>

      {/* Overlap zone (brightest — intersection highlight) */}
      <g>
        {CC_OVERLAP.map(([c, r], i) => (
          <rect key={`co${i}`} x={c * pitch} y={r * pitch} width={cell} height={cell} fill={GREEN_LIGHT} stroke="#5FCC82" strokeWidth={0.3} rx={2} />
        ))}
      </g>

      {/* Front C (lighter, on top) */}
      <g>
        {CC_FRONT.map(([c, r], i) => (
          <rect key={`cf${i}`} x={c * pitch} y={r * pitch} width={cell} height={cell} fill="url(#cc-front-grad)" stroke={GREEN_BORDER} strokeWidth={0.2} rx={2} />
        ))}
      </g>
    </svg>
  )
}

/* ── styles ────────────────────────────────────────── */

const heroSection: React.CSSProperties = {
  minHeight: '70vh',
  display: 'flex',
  flexDirection: 'column',
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
  maxWidth: '1000px',
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
      {/* Hero with block art title + CC mascot */}
      <section className="full-bleed" style={heroSection}>
        <div style={heroInner}>
          <MotionReveal variant="fadeUp" delay={0.1}>
            <div style={heroLeft}>
              {/* CLAUDE in block art */}
              <BlockArt
                coords={CLAUDE_COORDS}
                cols={CLAUDE_COLS}
                rows={CLAUDE_ROWS}
                cellSize={12}
                gap={1}
                gradientId="claude-grad"
                style={{ width: '100%', height: 'auto', marginBottom: '4px' }}
              />
              {/* DAILY in block art */}
              <BlockArt
                coords={DAILY_COORDS}
                cols={DAILY_COLS}
                rows={DAILY_ROWS}
                cellSize={12}
                gap={1}
                gradientId="daily-grad"
                style={{ width: `${(DAILY_COLS / CLAUDE_COLS) * 100}%`, height: 'auto' }}
              />

              <p style={heroSubtitle}>
                ecosystem digest from the trenches.
                <br />
                what builders shipped, what broke, what matters.
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

          <MotionReveal variant="fadeUp" delay={0.3}>
            <div className="cc-mascot-wrap" style={{ flexShrink: 0 }}>
              <CCMascot />
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
                  <div style={latestMeta}>
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
