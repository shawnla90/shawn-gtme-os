'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { DailyLogSummary, LogAggregates } from '@shawnos/shared/lib/logs'
import type { RPGProfile } from '@shawnos/shared/lib/rpg'
import { LogCard, LogHero } from '@shawnos/shared/components'

const GRADE_OPTIONS = ['All', 'S+', 'S', 'A+', 'A', 'B', 'C', 'D']

/** Map grade to accent color for the active filter button. */
function gradeAccent(grade: string): string {
  if (grade === 'S+') return '#FBBF24'
  if (grade === 'S') return '#8B5CF6'
  if (grade === 'A+') return '#06B6D4'
  if (grade === 'A') return '#10B981'
  if (grade === 'B') return '#64748B'
  if (grade === 'C') return '#94A3B8'
  return '#475569'
}

/** Format YYYY-MM-DD as "Thursday, Feb 13 2026" for search matching. */
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

interface LogIndexClientProps {
  logs: DailyLogSummary[]
  aggregates: LogAggregates
  profile: RPGProfile | null
  avatarUrls: {
    static?: string | null
    idle?: string | null
    action?: string | null
  } | null
  v3Grades: Record<string, string>
}

export default function LogIndexClient({
  logs,
  aggregates,
  profile,
  avatarUrls,
  v3Grades,
}: LogIndexClientProps) {
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')

  const filtered = logs.filter((log) => {
    const grade = v3Grades[log.date] ?? log.letter_grade
    if (gradeFilter !== 'All' && grade !== gradeFilter) return false
    if (
      search &&
      !log.date.includes(search) &&
      !formatDate(log.date).toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <section
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <LogHero
        aggregates={aggregates}
        showAvatar
        profile={profile ?? undefined}
        avatarSrc={avatarUrls?.static ?? undefined}
        avatarIdleSrc={avatarUrls?.idle ?? undefined}
        avatarActionSrc={avatarUrls?.action ?? undefined}
      />

      {/* CTA — character progression */}
      {profile && (
        <Link
          href="/log/progression"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            marginBottom: '12px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--accent)',
            borderRadius: '6px',
            textDecoration: 'none',
            transition: 'border-color 0.15s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D1117',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {profile.level}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                {profile.title}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {profile.xp_total.toLocaleString()} / {profile.xp_next_level.toLocaleString()} XP
              </div>
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            View Progression &rarr;
          </span>
        </Link>
      )}

      {/* CTA — skill guide */}
      <Link
        href="/log/skill-guide"
        style={{
          display: 'block',
          padding: '14px 18px',
          marginBottom: '12px',
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--accent)',
          borderRadius: '6px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent)',
          transition: 'border-color 0.15s ease',
        }}
      >
        explore the skill guide &rarr;
      </Link>

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

      {/* Search + Grade filter */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <input
          type="text"
          placeholder="Search by date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--canvas-subtle)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {GRADE_OPTIONS.map((g) => {
            const active = gradeFilter === g
            return (
              <button
                key={g}
                onClick={() => setGradeFilter(g)}
                style={{
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  borderRadius: '14px',
                  border: active
                    ? `1px solid ${g === 'All' ? 'var(--accent)' : gradeAccent(g)}`
                    : '1px solid var(--border)',
                  background: active
                    ? g === 'All'
                      ? 'var(--accent)'
                      : gradeAccent(g)
                    : 'var(--canvas-subtle)',
                  color: active ? '#0D1117' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {g}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results count when filtering */}
      {(search || gradeFilter !== 'All') && (
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '12px',
          }}
        >
          Showing {filtered.length} of {logs.length} logs
        </p>
      )}

      {/* Log list */}
      {filtered.length === 0 ? (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}
        >
          {logs.length === 0
            ? 'No logs found. Check back soon.'
            : 'No logs match the current filter.'}
        </p>
      ) : (
        <div>
          {filtered.map((log) => {
            const grade = v3Grades[log.date] ?? log.letter_grade
            return (
              <LogCard
                key={log.date}
                {...log}
                letter_grade={grade}
                basePath="/log"
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
