'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface JobDetail {
  id: string
  name: string
  label: string
  system: string
  schedule: string
  scriptPath: string
  status: string
  exitCode: number
  pid: number | null
  killSwitch: { active: boolean; reason?: string; until?: string } | null
  recentLogs: any[]
  stdout: string
  stderr: string
}

function statusColor(status: string) {
  switch (status) {
    case 'running': return 'text-green-400'
    case 'loaded': return 'text-amber-400'
    case 'error': return 'text-red-400'
    default: return 'text-gray-500'
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [logView, setLogView] = useState<'stdout' | 'stderr'>('stdout')

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/crons/${id}`)
      if (res.ok) setJob(await res.json())
      else if (res.status === 404) router.push('/crons')
    } catch { /* ignore */ }
    setLoading(false)
  }, [id, router])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 10000)
    return () => clearInterval(interval)
  }, [refresh])

  const action = async (path: string, body?: any) => {
    setActing(true)
    try {
      await fetch(path, {
        method: 'POST',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
      })
      await new Promise((r) => setTimeout(r, 500))
      await refresh()
    } catch { /* ignore */ }
    setActing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-600 text-sm">Loading...</div>
      </div>
    )
  }

  if (!job) return <div className="text-red-400">Job not found</div>

  const isActive = job.status === 'running' || job.status === 'loaded'
  const logContent = logView === 'stdout' ? job.stdout : job.stderr

  return (
    <div className="space-y-4">
      {/* Back + header */}
      <Link href="/crons" className="text-xs text-gray-600 hover:text-green-400 transition-colors">
        &larr; Crons
      </Link>

      <div className="card !p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-green-300">{job.name}</h1>
          <span className={`text-xs font-medium ${statusColor(job.status)}`}>
            {job.status}{job.pid ? ` (PID ${job.pid})` : ''}
          </span>
        </div>
        <div className="text-[10px] text-gray-600 space-y-0.5">
          <div>Label: <span className="text-gray-500">{job.label}</span></div>
          <div>Schedule: <span className="text-gray-500">{job.schedule}</span></div>
          {job.exitCode !== 0 && job.exitCode !== -1 && (
            <div>Exit code: <span className="text-red-400">{job.exitCode}</span></div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        {isActive ? (
          <button
            onClick={() => action(`/api/crons/${id}/stop`)}
            disabled={acting}
            className="btn text-xs !bg-red-900/30 !text-red-300 !border-red-800/40 hover:!bg-red-800/30"
          >
            {acting ? '...' : 'Stop'}
          </button>
        ) : (
          <button
            onClick={() => action(`/api/crons/${id}/start`)}
            disabled={acting}
            className="btn text-xs"
          >
            {acting ? '...' : 'Start'}
          </button>
        )}

        <button
          onClick={() => action(`/api/crons/${id}/run`)}
          disabled={acting}
          className="btn text-xs"
        >
          {acting ? '...' : 'Run Now'}
        </button>

        {job.killSwitch !== null && (
          <button
            onClick={() =>
              action('/api/kill-switches', {
                system: job.system,
                active: !job.killSwitch?.active,
                reason: job.killSwitch?.active ? 'Manual deactivation' : 'Manual activation',
              })
            }
            disabled={acting}
            className={`btn text-xs ${
              job.killSwitch.active
                ? '!bg-red-900/30 !text-red-300 !border-red-800/40'
                : ''
            }`}
          >
            {acting ? '...' : job.killSwitch.active ? 'Kill Switch ON' : 'Kill Switch OFF'}
          </button>
        )}

        <button onClick={refresh} className="btn text-xs ml-auto">
          Refresh
        </button>
      </div>

      {/* Kill switch banner */}
      {job.killSwitch?.active && (
        <div className="card !p-3 !border-red-800/40 !bg-red-950/30">
          <div className="text-xs text-red-400 font-medium">Kill switch active</div>
          <div className="text-[10px] text-red-400/60 mt-0.5">
            {job.killSwitch.reason}
            {job.killSwitch.until && (
              <> &middot; Until {new Date(job.killSwitch.until).toLocaleString()}</>
            )}
          </div>
        </div>
      )}

      {/* Recent runs */}
      {job.recentLogs.length > 0 && (
        <div className="card !p-4">
          <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Recent Runs</div>
          <div className="space-y-2">
            {job.recentLogs.map((log: any, i: number) => (
              <div key={i} className="flex items-start gap-2 text-[10px]">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                  log.error ? 'bg-red-400' : 'bg-green-400'
                }`} />
                <div className="min-w-0">
                  <div className="text-gray-500 truncate">{log.file}</div>
                  {log.mode && (
                    <div className="text-gray-700">
                      {log.mode} &middot; {log.refined ?? log.matches ?? '?'} matches
                      {log.results?.length ? ` &middot; ${log.results.length} posted` : ''}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log viewer */}
      <div className="card !p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] text-gray-600 uppercase tracking-wider">Logs</div>
          <div className="flex gap-1">
            <button
              onClick={() => setLogView('stdout')}
              className={`text-[9px] px-2 py-0.5 rounded ${
                logView === 'stdout' ? 'bg-green-900/30 text-green-400' : 'text-gray-600'
              }`}
            >
              stdout
            </button>
            <button
              onClick={() => setLogView('stderr')}
              className={`text-[9px] px-2 py-0.5 rounded ${
                logView === 'stderr' ? 'bg-green-900/30 text-green-400' : 'text-gray-600'
              }`}
            >
              stderr
            </button>
          </div>
        </div>
        <pre className="text-[10px] text-gray-500 bg-black/50 rounded p-3 overflow-x-auto max-h-[40vh] overflow-y-auto leading-relaxed">
          {logContent || 'No log output'}
        </pre>
      </div>
    </div>
  )
}
