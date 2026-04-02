'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Job {
  id: string
  name: string
  system: string
  schedule: string
  status: string
  exitCode: number
  pid: number | null
  lastRun: string | null
  killSwitch: { active: boolean; reason?: string } | null
}

interface SystemGroup {
  label: string
  jobs: Job[]
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'never'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function statusDot(status: string): string {
  switch (status) {
    case 'running': return 'status-active'
    case 'loaded': return 'status-active'
    case 'crontab': return 'status-active'
    case 'error': return 'status-offline'
    default: return 'bg-gray-600'
  }
}

function statusLabel(status: string, exitCode: number): string {
  if (status === 'loaded' && exitCode === 0) return 'Active'
  if (status === 'running') return 'Running'
  if (status === 'crontab') return 'Active'
  if (status === 'error') return exitCode === 128 ? 'Exit 128' : 'Error'
  if (status === 'stopped') return 'Stopped'
  return status
}

// Parse schedule string into a sortable hour for the timeline
function scheduleHour(schedule: string): number | null {
  const m = schedule.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)/i)
  if (m) {
    let h = parseInt(m[1])
    const ampm = (m[3] || '').toUpperCase()
    if (ampm === 'PM' && h < 12) h += 12
    if (ampm === 'AM' && h === 12) h = 0
    return h
  }
  const m2 = schedule.match(/Daily\s+(\d{1,2}):?(\d{2})?\s*(PM|AM)?/i)
  if (m2) {
    let h = parseInt(m2[1])
    if (m2[3]?.toUpperCase() === 'PM' && h < 12) h += 12
    return h
  }
  return null
}

// Build 24h timeline data
function buildTimeline(allJobs: Job[]): { hour: number; label: string; jobs: Job[] }[] {
  const hours: Map<number, Job[]> = new Map()

  for (const job of allJobs) {
    const h = scheduleHour(job.schedule)
    if (h !== null) {
      if (!hours.has(h)) hours.set(h, [])
      hours.get(h)!.push(job)
    }
  }

  return Array.from(hours.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([hour, jobs]) => ({
      hour,
      label: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
      jobs,
    }))
}

export default function CronsPage() {
  const [data, setData] = useState<{ systems: Record<string, SystemGroup>; total: number; active: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'status' | 'timeline'>('status')

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/crons')
      if (res.ok) setData(await res.json())
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [refresh])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600 text-sm">Loading crons...</div>
      </div>
    )
  }

  if (!data) {
    return <div className="text-red-400 text-sm">Failed to load cron data</div>
  }

  const systemOrder = ['ig', 'x', 'gtme', 'clearbox']
  const allJobs = Object.values(data.systems).flatMap((g) => g.jobs)
  const intervalJobs = allJobs.filter((j) => j.schedule.startsWith('Every'))
  const scheduledJobs = allJobs.filter((j) => !j.schedule.startsWith('Every') && j.schedule !== 'Always-on')
  const timeline = buildTimeline(scheduledJobs)
  const currentHour = new Date().getHours()

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-green-300 tracking-wide">Crons</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {data.active}/{data.total} active
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === 'status' ? 'timeline' : 'status')}
            className="btn text-xs"
          >
            {view === 'status' ? 'Timeline' : 'Status'}
          </button>
          <button
            onClick={() => { setLoading(true); refresh() }}
            className="btn text-xs"
          >
            Refresh
          </button>
        </div>
      </div>

      {view === 'timeline' ? (
        <>
          {/* Timeline view */}
          <div className="card !p-4">
            <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-3">Daily Schedule</div>
            <div className="space-y-0">
              {timeline.map(({ hour, label, jobs }) => (
                <div key={hour} className="flex items-start gap-3 py-2 border-b border-gray-800/30 last:border-0">
                  <div className={`text-[10px] w-12 shrink-0 font-medium ${
                    hour === currentHour ? 'text-green-400' : 'text-gray-600'
                  }`}>
                    {hour === currentHour && <span className="inline-block w-1 h-1 rounded-full bg-green-400 mr-1 mb-px" />}
                    {label}
                  </div>
                  <div className="flex-1 flex flex-wrap gap-1">
                    {jobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/crons/${job.id}`}
                        className={`text-[9px] px-2 py-0.5 rounded-full border ${
                          job.status === 'loaded' || job.status === 'running' || job.status === 'crontab'
                            ? 'border-green-800/40 bg-green-900/20 text-green-400'
                            : 'border-gray-800/40 bg-gray-900/20 text-gray-500'
                        }`}
                      >
                        {job.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interval jobs */}
          {intervalJobs.length > 0 && (
            <div className="card !p-4">
              <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-3">Recurring</div>
              <div className="flex flex-wrap gap-2">
                {intervalJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/crons/${job.id}`}
                    className="flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-lg border border-gray-800/40 bg-gray-950/50 hover:border-green-800/40 transition-colors"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${statusDot(job.status)}`} />
                    <span className="text-green-300">{job.name}</span>
                    <span className="text-gray-600">{job.schedule}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Status view */}
          {systemOrder.map((key) => {
            const group = data.systems[key]
            if (!group) return null

            const activeCount = group.jobs.filter(
              (j) => j.status === 'running' || j.status === 'loaded' || j.status === 'crontab'
            ).length

            return (
              <div key={key}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="section-label text-green-700">{group.label}</span>
                  <span className="text-[9px] text-gray-700">
                    {activeCount}/{group.jobs.length}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-green-900/40 to-transparent" />
                </div>

                <div className="grid gap-2">
                  {group.jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/crons/${job.id}`}
                      className="card !p-4 flex items-center gap-3 hover:border-green-800/60 transition-all active:scale-[0.99]"
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${statusDot(job.status)}`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-green-300 font-medium truncate">
                            {job.name}
                          </span>
                          <span className="text-[10px] text-gray-600 shrink-0">
                            {timeAgo(job.lastRun)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-600">{job.schedule}</span>
                          <span className={`text-[9px] ${
                            job.status === 'error' ? 'text-red-400' :
                            job.status === 'stopped' ? 'text-gray-600' :
                            'text-green-600'
                          }`}>
                            {statusLabel(job.status, job.exitCode)}
                          </span>
                        </div>
                        {job.killSwitch?.active && (
                          <div className="text-[9px] text-red-400 mt-1">
                            Kill switch active{job.killSwitch.reason ? `: ${job.killSwitch.reason}` : ''}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
