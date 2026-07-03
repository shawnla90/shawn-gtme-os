'use client'

import { MotionReveal } from '@shawnos/shared/components'

interface LiveHeroProps {
  subscriberCount: number
  postCount: number
  newsItemCount: number
  lastUpdated: string | null
}

function formatLastUpdated(iso: string | null): string {
  if (!iso) return 'not yet synced'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

export default function LiveHero({ subscriberCount, postCount, newsItemCount, lastUpdated }: LiveHeroProps) {
  return (
    <section
      className="full-bleed"
      style={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--canvas)',
        position: 'relative',
        textAlign: 'center',
        padding: '80px 24px 48px',
      }}
    >
      <MotionReveal variant="fadeUp" delay={0.1}>
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.15,
            margin: '0 0 16px',
            maxWidth: 900,
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>Live </span>
          <span style={{ color: 'var(--accent)' }}>Feed</span>
        </h1>
      </MotionReveal>

      <MotionReveal variant="fadeUp" delay={0.2}>
        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.6,
            maxWidth: 640,
            margin: '0 auto 32px',
          }}
        >
          Curated AI news and builder community posts.
        </p>
      </MotionReveal>

      <MotionReveal variant="fadeUp" delay={0.3}>
        <div
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>
              {newsItemCount}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              News Items
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>
              {subscriberCount}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Subscribers
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>
              {postCount}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Posts
            </div>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal variant="fadeUp" delay={0.4}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            fontSize: 12,
            color: 'var(--text-muted)',
          }}
        >
          <span className="live-pulse-dot" />
          <span>live from the builder community - synced {formatLastUpdated(lastUpdated)}</span>
        </div>
      </MotionReveal>

      <div
        className="scroll-indicator"
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
  )
}
