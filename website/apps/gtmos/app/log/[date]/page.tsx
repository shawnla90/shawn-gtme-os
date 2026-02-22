import type { Metadata } from 'next'
import path from 'path'
import { getLogDates, getLogByDate, getWeeklyContext } from '@shawnos/shared/lib'
import { DailyLogView, LogDetailIntro } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'
const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

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
  const formatted = shortDate(date)
  const title = `Build Log | ${formatted} [${stats.letter_grade} ${stats.output_score}pts]`
  const description = `Shipped ${accomplishments.length} items, wrote ${stats.words_today.toLocaleString()} words. ${stats.finals_count} finalized. Score: ${stats.output_score} (${stats.letter_grade}). Daily build log from the GTM operating system.`
  const pageUrl = `${SITE_URL}/log/${date}`
  const ogImage = `/og?title=${encodeURIComponent(`Build Log | ${formatted}`)}&subtitle=${encodeURIComponent(`${stats.letter_grade} ${stats.output_score}pts · ${accomplishments.length} shipped · ${stats.words_today.toLocaleString()} words`)}`

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
      title: `${title} | thegtmos.ai`,
      description,
      url: pageUrl,
      publishedTime: date,
      authors: ['Shawn Tenam'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | thegtmos.ai`,
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
        weeklyContext={log.version >= 4 ? getWeeklyContext(date, LOG_DIR) : undefined}
      />
    </div>
  )
}
