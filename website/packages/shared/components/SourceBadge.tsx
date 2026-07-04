'use client'

import type { CSSProperties } from 'react'
import type { TimelineSource } from '../lib/timeline'

interface SourceBadgeProps {
  label: string
  source: TimelineSource
}

const sourceColor: Record<TimelineSource, string> = {
  blog: 'var(--accent)',
  substack: '#FF6719',
  reddit: '#FF4500',
  linkedin: '#0A66C2',
  newsletter: '#6D5EE9',
}

export function SourceBadge({ label, source }: SourceBadgeProps) {
  const dot: CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: sourceColor[source],
    flexShrink: 0,
  }
  const pill: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '3px 8px',
    borderRadius: 999,
    background: 'var(--canvas)',
    border: '1px solid var(--canvas-border, var(--border, rgba(255,255,255,0.10)))',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-secondary, var(--text-muted))',
    letterSpacing: '0.02em',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  }
  return (
    <span style={pill}>
      <span style={dot} aria-hidden />
      <span>{label}</span>
    </span>
  )
}
