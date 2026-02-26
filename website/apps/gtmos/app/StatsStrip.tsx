'use client'

import { useRef, useEffect, useState } from 'react'

/* ── stat definitions ──────────────────────────────── */

interface Stat {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: '147',  label: 'Pipeline Meetings Booked' },
  { value: '12.4%', label: 'Avg Reply Rate' },
  { value: '38',   label: 'Sequences Running' },
  { value: '24K',  label: 'Leads Enriched' },
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
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        background: 'rgba(249, 115, 22, 0.08)',
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
              fontFamily: 'var(--font-mono)',
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
