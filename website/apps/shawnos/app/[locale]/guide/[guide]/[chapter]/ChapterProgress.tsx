'use client'

import Link from 'next/link'

interface ChapterProgressProps {
  guideSlug: string
  current: number
  total: number
}

export function ChapterProgress({ guideSlug, current, total }: ChapterProgressProps) {
  const pct = (current / total) * 100

  return (
    <>
      <div className="guide-progress-bar" style={{ width: `${pct}%` }} />
      <Link
        href={`/guide/${guideSlug}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: 24,
          transition: 'color 0.15s',
        }}
      >
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
          {current}/{total}
        </span>
        <span>Back to guide</span>
      </Link>
    </>
  )
}
