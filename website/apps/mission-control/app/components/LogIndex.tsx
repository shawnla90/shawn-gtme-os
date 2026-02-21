'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { DailyLogSummary, LogAggregates } from '@shawnos/shared/lib/logs'
import type { RPGProfile } from '@shawnos/shared/lib/rpg'

function gradeClass(grade: string): { text: string; border: string } {
  if (grade === 'S+') return { text: 'text-yellow-400', border: 'border-yellow-400' }
  if (grade === 'S') return { text: 'text-purple-400', border: 'border-purple-400' }
  if (grade === 'A+') return { text: 'text-cyan-400', border: 'border-cyan-400' }
  if (grade === 'A') return { text: 'text-green-400', border: 'border-green-400' }
  if (grade === 'B') return { text: 'text-gray-400', border: 'border-gray-400' }
  return { text: 'text-red-500', border: 'border-red-500' }
}

function gradeBg(grade: string): string {
  if (grade === 'S+') return 'bg-yellow-400'
  if (grade === 'S') return 'bg-purple-400'
  if (grade === 'A+') return 'bg-cyan-400'
  if (grade === 'A') return 'bg-green-400'
  if (grade === 'B') return 'bg-gray-400'
  return 'bg-red-500'
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function compactNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

const GRADE_OPTIONS = ['All', 'S+', 'S', 'A+', 'A', 'B', 'C', 'D']

interface LogIndexProps {
  logs: DailyLogSummary[]
  aggregates: LogAggregates
  profile: RPGProfile | null
  v2Grades: Record<string, string>
}

export default function LogIndex({ logs, aggregates, profile, v2Grades }: LogIndexProps) {
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')

  // Client-side filtering
  const filtered = logs.filter((log) => {
    const grade = v2Grades[log.date] ?? log.letter_grade
    if (gradeFilter !== 'All' && grade !== gradeFilter) return false
    if (search && !log.date.includes(search) && !formatDate(log.date).toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Back to dashboard */}
      <Link href="/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
        &larr; Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">DAILY LOGS</h1>
        <p className="text-sm text-gray-500">Build receipts & analytics</p>
      </div>

      {/* Aggregate stats bar */}
      <div className="card grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <StatBox label="DAYS TRACKED" value={aggregates.totalDays} />
        <StatBox label="ITEMS SHIPPED" value={aggregates.totalShipped} />
        <StatBox label="FINALIZED" value={aggregates.totalFinals} />
        <StatBox label="WORDS WRITTEN" value={compactNum(aggregates.totalWords)} />
        <StatBox label="COMMITS" value={aggregates.totalCommits} />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-green-800 rounded px-3 py-2 text-sm text-green-300 placeholder-gray-600 focus:outline-none focus:border-green-500"
        />
        <div className="flex gap-1 flex-wrap">
          {GRADE_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                gradeFilter === g
                  ? 'bg-green-800 text-green-300'
                  : 'bg-gray-800 text-gray-500 hover:text-gray-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Progression banner */}
      {profile && (
        <Link href="/progression" className="block">
          <div className="card hover:bg-gray-800 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-green-900 flex items-center justify-center text-green-300 font-bold text-sm">
                {profile.level}
              </div>
              <div>
                <span className="text-green-300 font-medium">{profile.title}</span>
                <span className="text-gray-500 text-sm ml-2">LVL {profile.level}</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {profile.xp_total.toLocaleString()} / {profile.xp_next_level.toLocaleString()} XP
              <span className="ml-2 text-green-600">&rarr;</span>
            </div>
          </div>
        </Link>
      )}

      {/* Results count */}
      {(search || gradeFilter !== 'All') && (
        <div className="text-xs text-gray-500">
          Showing {filtered.length} of {logs.length} logs
        </div>
      )}

      {/* Log list */}
      <div className="space-y-2">
        {filtered.map((log) => {
          const grade = v2Grades[log.date] ?? log.letter_grade
          const gc = gradeClass(grade)
          return (
            <Link key={log.date} href={`/logs/${log.date}`} className="block group">
              <div className={`card hover:bg-gray-800 transition-colors border-l-4 ${gc.border}`}>
                {/* Top row: date + grade */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <time dateTime={log.date} className="text-sm font-semibold text-green-300">
                    {formatDate(log.date)}
                  </time>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-black ${gradeBg(grade)}`}>
                      {grade}
                    </span>
                    <span className={`text-sm font-semibold ${gc.text}`}>
                      {log.output_score} pts
                    </span>
                  </div>
                </div>
                {/* Stats row */}
                <div className="flex gap-5 mt-2 text-xs text-gray-500">
                  <span><span className="text-gray-300 font-medium">{log.accomplishment_count}</span> shipped</span>
                  <span><span className="text-gray-300 font-medium">{log.finals_count}</span> finalized</span>
                  <span><span className="text-gray-300 font-medium">{log.words_today.toLocaleString()}</span> words</span>
                  <span><span className="text-gray-300 font-medium">{log.commits_today}</span> commits</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center">
      <div className="text-xl font-bold text-green-400">{value}</div>
      <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}
