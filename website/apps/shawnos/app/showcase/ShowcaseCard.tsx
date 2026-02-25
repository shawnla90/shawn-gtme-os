import React from 'react'

/* ── types ─────────────────────────────────────────── */

export interface ShowcaseCardProps {
  /** Section header — rendered as `## title` terminal style */
  title: string
  /** Subtitle shown below the title in secondary text */
  description: string
  /** The live demo content rendered inside the card */
  children: React.ReactNode
  /** Optional stat badges rendered bottom-right */
  stats?: string[]
}

/* ── component ─────────────────────────────────────── */

export function ShowcaseCard({
  title,
  description,
  children,
  stats,
}: ShowcaseCardProps) {
  return (
    <div
      style={{
        padding: '24px',
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 6px 0',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>##</span>{' '}
          {title}
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          marginBottom: '20px',
        }}
      />

      {/* Live demo area */}
      <div>{children}</div>

      {/* Stats badges */}
      {stats && stats.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            justifyContent: 'flex-end',
          }}
        >
          {stats.map((stat) => (
            <span
              key={stat}
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'rgba(78, 195, 115, 0.08)',
                border: '1px solid rgba(78, 195, 115, 0.25)',
                borderRadius: '4px',
                letterSpacing: '0.03em',
              }}
            >
              {stat}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
