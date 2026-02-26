import type { ReactNode } from 'react'

interface SectionHeadlineProps {
  children: ReactNode
  subtitle?: string
  label?: string
}

export function SectionHeadline({ children, subtitle, label }: SectionHeadlineProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      {label && (
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            marginBottom: 12,
          }}
        >
          {label}
        </div>
      )}
      <h2
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: 'var(--text-secondary)',
            marginTop: 8,
            margin: '8px 0 0',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
