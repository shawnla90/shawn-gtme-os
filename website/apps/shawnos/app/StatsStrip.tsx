'use client'

import { useRef, useEffect, useState } from 'react'

/* ── stat definitions ──────────────────────────────── */

interface Stat {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: '4',    label: 'Websites' },
  { value: '3',    label: 'AI Agents' },
  { value: '150+', label: 'Knowledge Entries' },
  { value: '34',   label: 'Video Compositions' },
  { value: '10',   label: 'Blog Posts' },
]

/* ── component ─────────────────────────────────────── */

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1px',
        background: 'var(--border)',
        overflow: 'hidden',
      }}
      className="stats-strip"
    >
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className={`stats-item${visible ? ' visible' : ''}`}
          style={{
            padding: '32px 24px',
            background: 'var(--canvas-subtle)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              color: 'var(--accent)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {stat.value}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginTop: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
