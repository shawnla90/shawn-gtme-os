import type { Metadata } from 'next'
import path from 'path'
import Link from 'next/link'
import {
  getLogDates,
  getLogByDate,
  resolveDataRoot,
  getRPGProfileV3,
  getRPGProfileV2,
} from '@shawnos/shared/lib'
import type { V3ScoringEntry } from '@shawnos/shared/lib/rpg-v3'
import { gradeColorV3 } from '@shawnos/shared/lib/rpg-v3'
import { DailyLogView, LogDetailIntro, BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://shawnos.ai'
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

/* ── V3 entry lookup helper ───────────────────── */

function getV3Entry(date: string): V3ScoringEntry | null {
  const v3 = getRPGProfileV3(DATA_ROOT)
  if (v3?.v3_meta?.scoring_log) {
    const entry = v3.v3_meta.scoring_log.find((e) => e.date === date)
    if (entry) return entry
  }
  return null
}

function getV3Grade(date: string): string | null {
  const entry = getV3Entry(date)
  if (entry) return entry.v3_grade
  const v2 = getRPGProfileV2(DATA_ROOT)
  if (v2?.v2_meta?.scoring_log) {
    const e = v2.v2_meta.scoring_log.find((e) => e.date === date)
    if (e) return e.v2_grade
  }
  return null
}

/* ── V3 Scoring Panel ─────────────────────────── */

function V3ScoringPanel({ entry }: { entry: V3ScoringEntry }) {
  const gc = gradeColorV3(entry.v3_grade)
  const fmtPct = (v: number) => (v > 0 ? `+${(v * 100).toFixed(1)}%` : '—')

  const row = (label: string, value: string, color?: string) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '3px 0',
        fontSize: '13px',
      }}
    >
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: color ?? 'var(--text-primary)' }}>{value}</span>
    </div>
  )

  return (
    <div
      style={{
        marginTop: '20px',
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '480px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--accent)',
          marginBottom: '14px',
        }}
      >
        V3 Scoring Breakdown
      </div>

      {/* Hero stats */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '16px',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        <span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>XP </span>
          <span style={{ color: gc }}>{entry.v3_xp}</span>
        </span>
        <span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Grade </span>
          <span style={{ color: gc }}>{entry.v3_grade}</span>
        </span>
        <span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Momentum </span>
          <span style={{ color: 'var(--accent)' }}>{entry.momentum_mult.toFixed(2)}x</span>
        </span>
      </div>

      {/* Breakdown rows */}
      {row('Base Score', `${entry.base_score.toFixed(0)}  (from raw ${entry.raw_score})`)}
      {row('Chain', `${entry.ascending_chain}`, entry.ascending_chain > 1 ? 'var(--accent)' : undefined)}
      {row('Chain Bonus', fmtPct(entry.ascending_bonus))}
      {row('Streak', `${entry.streak_days}d`)}
      {row('Streak Bonus', fmtPct(entry.streak_bonus))}
      {row('Quality', fmtPct(entry.quality_bonus))}
      {row('Efficiency', fmtPct(entry.efficiency_bonus))}
      {row('Velocity', fmtPct(entry.velocity_bonus))}
      {row('Ship', fmtPct(entry.ship_bonus))}

      <div
        style={{
          borderTop: '1px solid var(--border)',
          marginTop: '8px',
          paddingTop: '8px',
        }}
      >
        {row('Total Bonus', fmtPct(entry.total_bonus), 'var(--accent)')}
        {row('Total Multiplier', `${entry.total_mult.toFixed(2)}x`, 'var(--accent)')}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '6px 0 0',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          <span style={{ color: 'var(--text-primary)' }}>V3 XP</span>
          <span style={{ color: gc }}>{entry.v3_xp}</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
          V1 raw was {entry.raw_score} pts
        </div>
      </div>

      <Link
        href="/log/progression"
        style={{
          display: 'block',
          marginTop: '14px',
          fontSize: '12px',
          color: 'var(--accent)',
          textDecoration: 'none',
        }}
      >
        View full progression &rarr;
      </Link>
    </div>
  )
}

/* ── Static generation ─────────────────────────── */

export function generateStaticParams() {
  const dates = getLogDates(LOG_DIR)
  return dates.map((date) => ({ date }))
}

/* ── Metadata ──────────────────────────────────── */

/** Format YYYY-MM-DD as "Feb 13, 2026". */
function shortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>
}): Promise<Metadata> {
  const { date } = await params
  const log = getLogByDate(date, LOG_DIR)

  if (!log) {
    return { title: 'Log Not Found' }
  }

  const { stats, accomplishments } = log
  const grade = getV3Grade(date) ?? stats.letter_grade
  const formatted = shortDate(date)
  const title = `Build Log | ${formatted} [${grade} ${stats.output_score}pts]`
  const description = `Shipped ${accomplishments.length} items, wrote ${stats.words_today.toLocaleString()} words. ${stats.finals_count} finalized. Score: ${stats.output_score} (${grade}). Daily build log from the GTM operating system.`
  const pageUrl = `${SITE_URL}/log/${date}`
  const ogImage = `/og?title=${encodeURIComponent(`Build Log | ${formatted}`)}&subtitle=${encodeURIComponent(`${grade} ${stats.output_score}pts · ${accomplishments.length} shipped · ${stats.words_today.toLocaleString()} words`)}`

  return {
    title,
    description,
    keywords: [
      'daily build log',
      'build in public',
      'GTM engineering',
      'content pipeline',
      'AI workflow tracking',
      'daily shipping',
    ],
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'article',
      title: `${title} | shawnos.ai`,
      description,
      url: pageUrl,
      publishedTime: date,
      authors: ['Shawn Tenam'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | shawnos.ai`,
      description,
      images: [ogImage],
    },
  }
}

/* ── Page ──────────────────────────────────────── */

export default async function LogPage({
  params,
}: {
  params: Promise<{ date: string }>
}) {
  const { date } = await params
  const log = getLogByDate(date, LOG_DIR)

  if (!log) {
    return (
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '40px 20px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <a
          href="/log"
          style={{
            fontSize: '13px',
            color: 'var(--accent)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: 24,
          }}
        >
          &larr; back to logs
        </a>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Log not found for {date}.
        </p>
      </div>
    )
  }

  // Override letter_grade with V3 grade if available
  const v3Entry = getV3Entry(date)
  const v3Grade = v3Entry?.v3_grade ?? getV3Grade(date)
  if (v3Grade) {
    log.stats.letter_grade = v3Grade
  }

  /* Compute prev / next dates for navigation */
  const allDates = getLogDates(LOG_DIR) // newest-first
  const idx = allDates.indexOf(date)
  const nextDate = idx > 0 ? allDates[idx - 1] : null // newer
  const prevDate = idx < allDates.length - 1 ? allDates[idx + 1] : null // older

  /* JSON-LD Article schema */
  const formatted = shortDate(date)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Build Log | ${formatted} [${log.stats.letter_grade} ${log.stats.output_score}pts]`,
    description: `Shipped ${log.accomplishments.length} items, wrote ${log.stats.words_today.toLocaleString()} words.`,
    datePublished: date,
    wordCount: log.stats.words_today,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/log/${date}`,
    url: `${SITE_URL}/log/${date}`,
  }

  return (
    <>
    <BreadcrumbSchema
      items={[
        { name: 'Log', url: `${SITE_URL}/log` },
        { name: formatted, url: `${SITE_URL}/log/${date}` },
      ]}
    />
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <a
        href="/log"
        style={{
          fontSize: '13px',
          color: 'var(--accent)',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: 24,
        }}
      >
        &larr; back to logs
      </a>

      <LogDetailIntro />

      <DailyLogView
        log={log}
        prevDate={prevDate}
        nextDate={nextDate}
        basePath="/log"
      />

      {v3Entry && <V3ScoringPanel entry={v3Entry} />}
    </div>
    </>
  )
}
