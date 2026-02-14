import React from 'react'

/**
 * LogDetailIntro — short contextual hero placed above DailyLogView on
 * individual /log/[date] detail pages.  Frames the auto-generated nature
 * of the build receipt without duplicating any data that DailyLogView
 * already displays.
 */
export function LogDetailIntro() {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        marginBottom: '28px',
        padding: '16px 20px',
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: '6px',
      }}
    >
      {/* Terminal prompt */}
      <div
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '6px',
          letterSpacing: '0.03em',
        }}
      >
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>$</span>{' '}
        cat ~/receipts/{'{'}date{'}'}.json
      </div>

      {/* Tagline */}
      <p
        style={{
          margin: 0,
          fontSize: '13px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
        }}
      >
        Auto-generated build receipt. Every item scanned from git
        commits, content drafts, finalized posts, and AI token usage. Not a
        screenshot. Not a mockup. Live data from the codebase.
      </p>
    </div>
  )
}
