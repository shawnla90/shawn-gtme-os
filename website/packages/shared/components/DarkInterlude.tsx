'use client'

import { MotionReveal } from './motion'

interface DarkInterludeProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function DarkInterlude({ title, subtitle, children }: DarkInterludeProps) {
  return (
    <section
      style={{
        backgroundColor: 'var(--canvas-dark)',
        padding: '80px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <MotionReveal>
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 40px)',
            fontWeight: 700,
            fontFamily: 'var(--font-sans, var(--font-mono))',
            color: 'rgba(255, 255, 255, 0.92)',
            letterSpacing: '-0.02em',
            marginBottom: subtitle ? 16 : 0,
            maxWidth: 700,
            margin: '0 auto',
          }}
        >
          {title}
        </h2>
      </MotionReveal>
      {subtitle && (
        <MotionReveal delay={0.1}>
          <p
            style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              color: 'rgba(255, 255, 255, 0.55)',
              maxWidth: 560,
              margin: '16px auto 0',
              lineHeight: 1.7,
              fontFamily: 'var(--font-sans, var(--font-mono))',
            }}
          >
            {subtitle}
          </p>
        </MotionReveal>
      )}
      {children && (
        <div style={{ marginTop: 40 }}>
          {children}
        </div>
      )}
    </section>
  )
}
