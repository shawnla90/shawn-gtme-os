import type { ReactNode } from 'react'

interface SectionHeadlineProps {
  children: ReactNode
  subtitle?: string
}

export function SectionHeadline({ children, subtitle }: SectionHeadlineProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
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
            fontFamily: 'var(--font-mono)',
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
