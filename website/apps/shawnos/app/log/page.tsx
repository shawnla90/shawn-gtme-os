import type { Metadata } from 'next'
import path from 'path'
import Link from 'next/link'
import { getAllLogs, getLogAggregates } from '@shawnos/shared/lib'
import { LogCard, LogHero } from '@shawnos/shared/components'

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export const metadata: Metadata = {
  title: 'Daily Build Log',
  description:
    'Daily build log from the GTM operating system — shipped items, word counts, content pipeline, AI workflow tracking.',
  keywords: [
    'daily build log',
    'GTM engineering',
    'build in public',
    'AI workflow tracking',
    'content pipeline',
  ],
  alternates: { canonical: 'https://shawnos.ai/log' },
  openGraph: {
    title: 'Daily Build Log | shawnos.ai',
    description:
      'Daily build log from the GTM operating system — shipped items, word counts, content pipeline, AI workflow tracking.',
    url: 'https://shawnos.ai/log',
    images: [
      {
        url: '/og?title=Daily+Build+Log&subtitle=Shipped+items%2C+word+counts%2C+content+pipeline',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Daily Build Log | shawnos.ai',
    description:
      'Daily build log from the GTM operating system — shipped items, word counts, content pipeline, AI workflow tracking.',
    images: [
      '/og?title=Daily+Build+Log&subtitle=Shipped+items%2C+word+counts%2C+content+pipeline',
    ],
  },
}

export default function LogIndex() {
  const logs = getAllLogs(LOG_DIR)
  const aggregates = getLogAggregates(LOG_DIR)

  return (
    <section
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <LogHero aggregates={aggregates} />

      {/* CTA — build your own */}
      <Link
        href="/log/build-your-own"
        style={{
          display: 'block',
          padding: '14px 18px',
          marginBottom: '24px',
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent)',
          transition: 'border-color 0.15s ease',
        }}
      >
        Want to build your own? Grab the prompt. &rarr;
      </Link>

      {logs.length === 0 ? (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}
        >
          No logs found. Check back soon.
        </p>
      ) : (
        <div>
          {logs.map((log) => (
            <LogCard key={log.date} {...log} basePath="/log" />
          ))}
        </div>
      )}
    </section>
  )
}
