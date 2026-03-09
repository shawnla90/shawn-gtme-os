'use client'

import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

/* ── stat definitions ──────────────────────────────── */

interface Stat {
  value: string
  label: string
}

function useStats(): Stat[] {
  const t = useTranslations('Home.stats')
  return [
    { value: '4',    label: t('websites') },
    { value: '3',    label: t('aiAgents') },
    { value: '150+', label: t('knowledgeEntries') },
    { value: '34',   label: t('videoCompositions') },
    { value: '10',   label: t('blogPosts') },
  ]
}

/* ── parse stat value ─────────────────────────────── */

function parseStat(value: string): { target: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/)
  if (!match) return { target: 0, suffix: '' }
  return { target: parseInt(match[1], 10), suffix: match[2] }
}

// Static values for bar width computation (labels change per locale, values don't)
const STAT_VALUES = ['4', '3', '150+', '34', '10']
const MAX_VALUE = Math.max(...STAT_VALUES.map((v) => parseStat(v).target))

/* ── easeOutExpo ──────────────────────────────────── */

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/* ── useCountUp hook ──────────────────────────────── */

function useCountUp(target: number, duration: number, trigger: boolean, delay: number) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let raf: number
    let startTime: number | null = null
    const delayMs = delay

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = easeOutExpo(progress)
        setCurrent(Math.round(eased * target))
        if (progress < 1) {
          raf = requestAnimationFrame(animate)
        }
      }
      raf = requestAnimationFrame(animate)
    }, delayMs)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, trigger, delay])

  return current
}

/* ── single stat cell ─────────────────────────────── */

function StatCell({ stat, index, triggered }: { stat: Stat; index: number; triggered: boolean }) {
  const { target, suffix } = parseStat(stat.value)
  const count = useCountUp(target, 1200, triggered, index * 150)
  const barWidth = target / MAX_VALUE

  return (
    <div
      style={{
        padding: '32px 24px',
        background: 'var(--canvas-subtle)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        opacity: triggered ? 1 : 0,
        transform: triggered ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.4s ease ${index * 0.15}s, transform 0.4s ease ${index * 0.15}s`,
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
        {count}{suffix}
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
      {/* Progress bar */}
      <div
        style={{
          marginTop: 12,
          height: 3,
          borderRadius: 2,
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 2,
            background: `linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 70%, white))`,
            width: triggered ? `${barWidth * 100}%` : '0%',
            transition: `width 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s`,
          }}
        />
      </div>
    </div>
  )
}

/* ── component ─────────────────────────────────────── */

export function StatsStrip() {
  const STATS = useStats()
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
      {STATS.map((stat, i) => (
        <StatCell key={stat.label} stat={stat} index={i} triggered={visible} />
      ))}
    </div>
  )
}
