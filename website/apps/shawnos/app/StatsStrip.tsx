'use client'

import { useRef, useEffect, useState } from 'react'

/* ── stat definitions ──────────────────────────────── */

interface Stat {
  value: string
  label: string
}

const STATS: Stat[] = [
  { value: '7',    label: 'Blog Posts' },
  { value: '40+',  label: 'Video Compositions' },
  { value: '3',    label: 'Websites' },
  { value: '470+', label: 'Avatar Sprites' },
  { value: '1',    label: 'AI Agent (Nio)' },
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
    <>
      <style>{`
        @keyframes stats-count-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stats-item {
          opacity: 0;
        }
        .stats-item.visible {
          animation: stats-count-up 0.5s ease forwards;
        }
        .stats-item.visible:nth-child(1) { animation-delay: 0.05s; }
        .stats-item.visible:nth-child(2) { animation-delay: 0.13s; }
        .stats-item.visible:nth-child(3) { animation-delay: 0.21s; }
        .stats-item.visible:nth-child(4) { animation-delay: 0.29s; }
        .stats-item.visible:nth-child(5) { animation-delay: 0.37s; }
      `}</style>

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
        <style>{`
          @media (max-width: 600px) {
            .stats-strip {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .stats-strip .stats-item:last-child {
              grid-column: 1 / -1;
            }
          }
        `}</style>

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
    </>
  )
}
