'use client'

import Link from 'next/link'
import type { DailyLog } from '@shawnos/shared/lib/logs'
import type { RPGProfile } from '@shawnos/shared/lib/rpg'
import LogTokenPanel from './LogTokenPanel'

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
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function activeWindow(first: string, last: string): string {
  if (!first || !last) return '—'
  return `${first} – ${last}`
}

const typeTag: Record<string, string> = {
  landing_page: 'bg-purple-900 text-purple-300',
  website_page: 'bg-blue-900 text-blue-300',
  website_route: 'bg-cyan-900 text-cyan-300',
  website_lib: 'bg-teal-900 text-teal-300',
  website_style: 'bg-pink-900 text-pink-300',
  code_infra: 'bg-yellow-900 text-yellow-300',
  system_engine: 'bg-orange-900 text-orange-300',
  skill_updated: 'bg-green-900 text-green-300',
}

interface LogDetailProps {
  log: DailyLog
  prevDate: string | null
  nextDate: string | null
  profile: RPGProfile | null
  v2Grade: string | null
}

export default function LogDetail({ log, prevDate, nextDate, profile, v2Grade }: LogDetailProps) {
  const grade = v2Grade ?? log.stats.letter_grade
  const gc = gradeClass(grade)
  const totalCost = log.token_usage.reduce((s, t) => s + (t.cost ?? 0), 0)

  // Platform breakdown
  const platforms = log.stats.platform_breakdown
  const platformTotal = Object.values(platforms).reduce((s, v) => s + v, 0)
  const platformColors: Record<string, string> = {
    website: 'bg-green-500',
    linkedin: 'bg-blue-500',
    x: 'bg-gray-400',
    substack: 'bg-orange-400',
    reddit: 'bg-red-500',
    other: 'bg-gray-600',
  }

  return (
    <div className="space-y-6">
      {/* Nav */}
      <Link href="/logs" className="text-sm text-green-600 hover:text-green-400 transition-colors">
        &larr; All Logs
      </Link>

      {/* Header */}
      <div className={`card border-l-4 ${gc.border}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-green-300">{formatDate(log.date)}</h1>
            <p className="text-xs text-gray-500 mt-1">
              Active: {activeWindow(log.stats.first_activity, log.stats.last_activity)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full text-black ${gradeBg(grade)}`}>
              {grade}
            </span>
            <span className={`text-2xl font-bold ${gc.text}`}>
              {log.stats.output_score}
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Shipped" value={log.stats.shipped_count ?? log.accomplishments.length} />
        <StatCard label="Finalized" value={log.stats.finals_count} />
        <StatCard label="Words" value={log.stats.words_today.toLocaleString()} />
        <StatCard label="Commits" value={log.git_summary.commits_today} />
        <StatCard label="Cost" value={`$${totalCost.toFixed(2)}`} />
        <StatCard label="ROI" value={log.stats.roi_multiplier ? `${log.stats.roi_multiplier.toFixed(0)}x` : '—'} />
      </div>

      {/* Platform breakdown bar */}
      {platformTotal > 0 && (
        <div className="card">
          <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Platform Breakdown</h3>
          <div className="flex h-4 rounded overflow-hidden">
            {Object.entries(platforms).map(([plat, count]) => {
              const w = (count / platformTotal) * 100
              if (w === 0) return null
              return (
                <div
                  key={plat}
                  className={`${platformColors[plat.toLowerCase()] ?? 'bg-gray-600'} relative group`}
                  style={{ width: `${w}%` }}
                  title={`${plat}: ${count}`}
                />
              )
            })}
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-500 flex-wrap">
            {Object.entries(platforms).map(([plat, count]) => (
              <span key={plat}>
                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${platformColors[plat.toLowerCase()] ?? 'bg-gray-600'}`} />
                {plat}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Three-column panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Accomplishments */}
        <div className="card lg:col-span-1">
          <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">
            Shipped ({log.accomplishments.length})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {log.accomplishments.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 ${typeTag[a.type] ?? 'bg-gray-800 text-gray-400'}`}>
                  {a.type.replace(/_/g, ' ')}
                </span>
                <span className="text-gray-300">{a.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Up */}
        <div className="card lg:col-span-1">
          <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-3">Pipeline</h3>
          {log.pipeline.drafts_active.length > 0 ? (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {log.pipeline.drafts_active.slice(0, 15).map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 shrink-0 uppercase text-[10px] w-8">{d.platform.slice(0, 3)}</span>
                  <span className="text-gray-400">{d.title}</span>
                </div>
              ))}
              {log.pipeline.drafts_active.length > 15 && (
                <div className="text-xs text-gray-600">+{log.pipeline.drafts_active.length - 15} more</div>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-600">No active drafts</p>
          )}

          {log.todos.length > 0 && (
            <>
              <h4 className="text-xs font-bold text-green-500 uppercase tracking-wider mt-4 mb-2">TODOs</h4>
              {log.todos.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-xs">
                  <span className={t.status === 'done' ? 'text-green-500' : 'text-gray-500'}>
                    {t.status === 'done' ? '[x]' : '[ ]'}
                  </span>
                  <span className={`${t.status === 'done' ? 'text-gray-600 line-through' : 'text-gray-400'} ${t.priority === 'high' ? 'font-medium' : ''}`}>
                    {t.task}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Analytics */}
        <div className="card lg:col-span-1 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2">Economics</h3>
            <div className="text-xs space-y-1">
              <Row label="Agent cost" value={`$${totalCost.toFixed(2)}`} />
              {log.stats.dev_equivalent_cost != null && (
                <Row label="Dev equivalent" value={`$${log.stats.dev_equivalent_cost.toLocaleString()}`} />
              )}
              {log.stats.cost_savings != null && (
                <Row label="Savings" value={`$${log.stats.cost_savings.toLocaleString()}`} />
              )}
              {log.stats.efficiency_rating != null && (
                <Row label="Efficiency" value={`${log.stats.efficiency_rating.toFixed(1)} pts/$`} />
              )}
            </div>
          </div>

          <LogTokenPanel tokenUsage={log.token_usage} />
        </div>
      </div>

      {/* Progression link */}
      {profile && (
        <Link href="/progression" className="block">
          <div className="card hover:bg-gray-800 transition-colors flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-green-900 flex items-center justify-center text-green-300 font-bold text-sm">
              {profile.level}
            </div>
            <span className="text-green-300 font-medium">{profile.title}</span>
            <span className="text-gray-500 text-sm">LVL {profile.level}</span>
            <span className="ml-auto text-green-600 text-sm">&rarr;</span>
          </div>
        </Link>
      )}

      {/* Footer: prev/next navigation */}
      <div className="flex justify-between">
        {prevDate ? (
          <Link href={`/logs/${prevDate}`} className="text-sm text-green-600 hover:text-green-400 transition-colors">
            &larr; {prevDate}
          </Link>
        ) : <span />}
        {nextDate ? (
          <Link href={`/logs/${nextDate}`} className="text-sm text-green-600 hover:text-green-400 transition-colors">
            {nextDate} &rarr;
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card text-center py-4">
      <div className="text-lg font-bold text-green-400">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-gray-500">
      <span>{label}</span>
      <span className="text-gray-300">{value}</span>
    </div>
  )
}
