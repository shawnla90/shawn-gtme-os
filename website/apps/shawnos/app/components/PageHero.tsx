'use client'

import { MotionReveal } from './motion/MotionReveal'

interface PageHeroProps {
  title: string
  titleAccent?: string
  subtitle?: string
  compact?: boolean
}

export function PageHero({ title, titleAccent, subtitle, compact = true }: PageHeroProps) {
  return (
    <section
      className="full-bleed"
      style={{
        minHeight: compact ? '60vh' : '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--canvas)',
        position: 'relative',
        textAlign: 'center',
        padding: '0 24px',
      }}
    >
      <MotionReveal variant="fadeUp" delay={0.1}>
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.15,
            margin: '0 0 24px',
            maxWidth: 900,
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>{title}</span>
          {titleAccent && (
            <>
              {' '}
              <span style={{ color: 'var(--accent)' }}>{titleAccent}</span>
            </>
          )}
        </h1>
      </MotionReveal>

      {subtitle && (
        <MotionReveal variant="fadeUp" delay={0.25}>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.6,
              maxWidth: 640,
              margin: '0 auto',
            }}
          >
            {subtitle}
          </p>
        </MotionReveal>
      )}

      {/* Scroll indicator */}
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
