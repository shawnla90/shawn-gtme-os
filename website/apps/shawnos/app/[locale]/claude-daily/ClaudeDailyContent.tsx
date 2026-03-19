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
const GREEN_BORDER = '#3A9A5A'
const GREEN_DIM = '#4EC37344'
const GREEN_GLOW = '#4EC37318'

/* ── pixel font (6-wide × 8-tall, 2px-stroke style) ─ */

const FONT: Record<string, string[]> = {
  C: ['.XXXX.', 'XX..XX', 'XX....', 'XX....', 'XX....', 'XX....', 'XX..XX', '.XXXX.'],
  L: ['XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XXXXXX'],
  A: ['.XXXX.', 'XX..XX', 'XX..XX', 'XXXXXX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX'],
  U: ['XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', '.XXXX.'],
  D: ['XXXX..', 'XX.XX.', 'XX..XX', 'XX..XX', 'XX..XX', 'XX..XX', 'XX.XX.', 'XXXX..'],
  E: ['XXXXXX', 'XX....', 'XX....', 'XXXXX.', 'XX....', 'XX....', 'XX....', 'XXXXXX'],
  I: ['XXXX', '.XX.', '.XX.', '.XX.', '.XX.', '.XX.', '.XX.', 'XXXX'],
  Y: ['XX..XX', 'XX..XX', '.XXXX.', '..XX..', '..XX..', '..XX..', '..XX..', '..XX..'],
  ' ': ['...', '...', '...', '...', '...', '...', '...', '...'],
}

/* ── pixel text renderer ──────────────────────────── */

function PixelText({ text, cellSize = 6, gap = 1.5 }: { text: string; cellSize?: number; gap?: number }) {
  const pitch = cellSize + gap
  const rects: React.ReactElement[] = []
  let cursorX = 0

  for (let ci = 0; ci < text.length; ci++) {
    const char = text[ci]
    const grid = FONT[char]
    if (!grid) { cursorX += 3; continue }

    const charWidth = grid[0].length

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === 'X') {
          rects.push(
            <rect
              key={`${ci}-${row}-${col}`}
              x={(cursorX + col) * pitch}
              y={row * pitch}
              width={cellSize}
              height={cellSize}
              fill={GREEN}
              stroke={GREEN_BORDER}
              strokeWidth={0.4}
              rx={0.8}
            />
          )
        }
      }
    }

    cursorX += charWidth + 1
  }

  const totalWidth = (cursorX - 1) * pitch
  const totalHeight = 8 * pitch

  return (
    <svg
      viewBox={`-2 -2 ${totalWidth + 4} ${totalHeight + 4}`}
      style={{ width: '100%', maxWidth: `${totalWidth * 1.1}px`, height: 'auto' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow layer */}
      <defs>
        <filter id="pixel-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>
      <g filter="url(#pixel-glow)" opacity="0.35">
        {rects}
      </g>
      {/* Sharp layer */}
      <g>{rects}</g>
    </svg>
  )
}

/* ── CC pixel icon ────────────────────────────────── */

function CCIcon() {
  const cell = 14
  const gap = 2
  const pitch = cell + gap
  const grid = FONT['C']
  const charW = 6
  const rects: React.ReactElement[] = []

  // Two C's side by side
  const offsets = [0, charW + 1]
  offsets.forEach((ox, ci) => {
    grid.forEach((row, ry) => {
      for (let cx = 0; cx < row.length; cx++) {
        if (row[cx] === 'X') {
          rects.push(
            <rect
              key={`cc-${ci}-${ry}-${cx}`}
              x={(ox + cx) * pitch}
              y={ry * pitch}
              width={cell}
              height={cell}
              fill={GREEN}
              stroke={GREEN_BORDER}
              strokeWidth={0.6}
              rx={1.5}
            />
          )
        }
      }
    })
  })

  const totalW = (charW * 2 + 1) * pitch
  const totalH = 8 * pitch
  const pad = 28

  return (
    <svg
      width={totalW + pad * 2}
      height={totalH + pad * 2}
      viewBox={`${-pad} ${-pad} ${totalW + pad * 2} ${totalH + pad * 2}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Dark rounded background */}
      <rect
        x={-pad + 4}
        y={-pad + 4}
        width={totalW + pad * 2 - 8}
        height={totalH + pad * 2 - 8}
        rx={20}
        fill="#161b22"
        stroke={GREEN_DIM}
        strokeWidth={1}
      />

      {/* Outer glow ring */}
      <rect
        x={-pad + 4}
        y={-pad + 4}
        width={totalW + pad * 2 - 8}
        height={totalH + pad * 2 - 8}
        rx={20}
        fill="none"
        stroke={GREEN_GLOW}
        strokeWidth={8}
      />

      {/* Glow layer */}
      <defs>
        <filter id="cc-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>
      <g filter="url(#cc-glow)" opacity="0.4">
        {rects}
      </g>

      {/* Sharp tiles */}
      <g>{rects}</g>
    </svg>
  )
}

/* ── styles ────────────────────────────────────────── */

const heroSection: React.CSSProperties = {
  minHeight: '60vh',
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
  gap: '40px',
  maxWidth: '960px',
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
      {/* Branded hero with pixel art title + CC icon */}
      <section className="full-bleed" style={heroSection}>
        <div style={heroInner}>
          <MotionReveal variant="fadeUp" delay={0.1}>
            <div style={heroLeft}>
              <PixelText text="CLAUDE DAILY" cellSize={7} gap={1.5} />
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
            <div className="cc-icon-wrap" style={{ flexShrink: 0 }}>
              <CCIcon />
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
          .cc-icon-wrap { display: none; }
        }
      `}</style>
    </>
  )
}
