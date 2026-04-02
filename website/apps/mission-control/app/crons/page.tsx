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
    case 'loaded': return 'status-idle'
    case 'crontab': return 'status-idle'
    case 'error': return 'status-offline'
    default: return 'bg-gray-600'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'running': return 'Running'
    case 'loaded': return 'Loaded'
    case 'stopped': return 'Stopped'
    case 'error': return 'Error'
    case 'crontab': return 'Crontab'
    default: return status
  }
}

export default function CronsPage() {
  const [data, setData] = useState<{ systems: Record<string, SystemGroup>; total: number; active: number } | null>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-green-300 tracking-wide">Crons</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            {data.active}/{data.total} active
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); refresh() }}
          className="btn text-xs"
        >
          Refresh
        </button>
      </div>

      {/* System groups */}
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
                        'text-gray-500'
                      }`}>
                        {statusLabel(job.status)}
                        {job.exitCode !== 0 && job.exitCode !== -1 ? ` (${job.exitCode})` : ''}
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
    </div>
  )
}
