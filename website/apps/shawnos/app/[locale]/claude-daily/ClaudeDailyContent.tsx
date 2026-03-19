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

/* ── brand color ──────────────────────────────────── */

const GREEN = '#4EC373'
const GREEN_DIM = '#4EC37344'
const GREEN_GLOW = '#4EC37322'

/* ── CC logo SVG ──────────────────────────────────── */

function CCLogo() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Terminal window frame */}
      <rect x="10" y="10" width="200" height="200" rx="16" fill="#0d1117" stroke={GREEN_DIM} strokeWidth="1.5" />

      {/* Outer glow */}
      <rect x="10" y="10" width="200" height="200" rx="16" fill="none" stroke={GREEN_GLOW} strokeWidth="6" />

      {/* Traffic light dots */}
      <circle cx="34" cy="32" r="5" fill="#FF5F57" opacity="0.7" />
      <circle cx="52" cy="32" r="5" fill="#FEBC2E" opacity="0.7" />
      <circle cx="70" cy="32" r="5" fill={GREEN} opacity="0.7" />

      {/* Prompt symbol */}
      <text x="32" y="108" fontFamily="var(--font-mono), 'JetBrains Mono', monospace" fontSize="22" fill={GREEN} opacity="0.5" fontWeight="400">
        {'>_'}
      </text>

      {/* CC monogram */}
      <text x="68" y="118" fontFamily="var(--font-mono), 'JetBrains Mono', monospace" fontSize="72" fill={GREEN} fontWeight="700" letterSpacing="-2">
        CC
      </text>

      {/* Blinking cursor */}
      <rect x="182" y="82" width="3" height="40" fill={GREEN} opacity="0.8">
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.2s" repeatCount="indefinite" />
      </rect>

      {/* Divider line */}
      <line x1="32" y1="138" x2="188" y2="138" stroke={GREEN_DIM} strokeWidth="1" />

      {/* claude-daily label */}
      <text x="110" y="162" fontFamily="var(--font-mono), 'JetBrains Mono', monospace" fontSize="13" fill={GREEN} opacity="0.7" textAnchor="middle" letterSpacing="2" fontWeight="500">
        CLAUDE DAILY
      </text>

      {/* Subtle scanline effect */}
      <line x1="32" y1="175" x2="80" y2="175" stroke={GREEN} strokeWidth="1" opacity="0.15" />
      <line x1="86" y1="175" x2="140" y2="175" stroke={GREEN} strokeWidth="1" opacity="0.1" />
      <line x1="146" y1="175" x2="188" y2="175" stroke={GREEN} strokeWidth="1" opacity="0.08" />

      {/* Version badge */}
      <text x="110" y="192" fontFamily="var(--font-mono), 'JetBrains Mono', monospace" fontSize="9" fill={GREEN} opacity="0.35" textAnchor="middle" letterSpacing="1">
        v1.0 // ecosystem digest
      </text>
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
  gap: '48px',
  maxWidth: '960px',
  width: '100%',
}

const heroLeft: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const heroRight: React.CSSProperties = {
  flexShrink: 0,
}

const heroTitle: React.CSSProperties = {
  fontSize: 'clamp(32px, 5vw, 56px)',
  fontWeight: 700,
  fontFamily: 'var(--font-mono)',
  lineHeight: 1.15,
  margin: '0 0 16px',
  color: 'var(--text-primary)',
}

const heroTitleAccent: React.CSSProperties = {
  color: GREEN,
}

const heroSubtitle: React.CSSProperties = {
  fontSize: 'clamp(14px, 1.8vw, 18px)',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-mono)',
  lineHeight: 1.6,
  margin: '0 0 24px',
}

const heroMeta: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexWrap: 'wrap',
}

const subtitleRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '32px',
  flexWrap: 'wrap',
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

const readLink: React.CSSProperties = {
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

const archiveDate: React.CSSProperties = {
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

/* ── responsive helper ────────────────────────────── */

const mobileLogoHide: React.CSSProperties = {
  ...heroRight,
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
      {/* Custom branded hero with CC logo */}
      <section className="full-bleed" style={heroSection}>
        <div style={heroInner}>
          <MotionReveal variant="fadeUp" delay={0.1}>
            <div style={heroLeft}>
              <h1 style={heroTitle}>
                Claude Code{' '}
                <span style={heroTitleAccent}>Daily</span>
              </h1>
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
            <div style={mobileLogoHide} className="cc-logo-wrap">
              <CCLogo />
            </div>
          </MotionReveal>
        </div>

        {/* Scroll indicator */}
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
            {/* Latest digest */}
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
                    <span style={readLink}>read &rarr;</span>
                  </div>
                </Link>
              </div>
            )}

            {/* Archive timeline */}
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
                        <time dateTime={post.date} style={archiveDate}>
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

      {/* Hide logo on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .cc-logo-wrap { display: none; }
        }
      `}</style>
    </>
  )
}
