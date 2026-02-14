import React from 'react'
import type { DailyLogSummary } from '../lib/logs'

interface LogCardProps extends DailyLogSummary {
  /** Base path for the log link, e.g. "/log" */
  basePath?: string
}

/** Map letter grade to a color string. */
function gradeColor(grade: string): string {
  if (grade.startsWith('A')) return '#4EC373'
  if (grade.startsWith('B')) return '#50BEDC'
  if (grade.startsWith('C')) return '#DCA83C'
  return '#E05555'
}

/** Format YYYY-MM-DD as "Thursday, Feb 13 2026". */
function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function LogCard({
  date,
  output_score,
  letter_grade,
  accomplishment_count,
  words_today,
  finals_count,
  commits_today,
  basePath = '/log',
}: LogCardProps) {
  const color = gradeColor(letter_grade)

  return (
    <>
      <style>{`
        .log-card { transition: border-color 0.15s ease; }
        .log-card:hover { border-color: var(--accent) !important; }
        .log-card-link { text-decoration: none; color: inherit; display: block; }
      `}</style>
      <article
        className="log-card"
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          borderLeft: `3px solid ${color}`,
          background: 'var(--canvas)',
        }}
      >
        <a href={`${basePath}/${date}`} className="log-card-link">
          {/* Top row: date + grade badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <time
              dateTime={date}
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {formatDate(date)}
            </time>

            {/* Grade pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: color,
                  color: '#0D1117',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  lineHeight: 1.4,
                }}
              >
                {letter_grade}
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color,
                }}
              >
                {output_score} pts
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '12px',
              flexWrap: 'wrap',
            }}
          >
            <Stat label="shipped" value={accomplishment_count} />
            <Stat label="finalized" value={finals_count} />
            <Stat label="words" value={words_today.toLocaleString()} />
            <Stat label="commits" value={commits_today} />
          </div>

          {/* View link */}
          <span
            style={{
              display: 'inline-block',
              marginTop: '12px',
              fontSize: '13px',
              color: 'var(--accent)',
            }}
          >
            view log &rarr;
          </span>
        </a>
      </article>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
        {value}
      </span>{' '}
      {label}
    </span>
  )
}
