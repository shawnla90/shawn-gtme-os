'use client'

import { useState, useEffect } from 'react'
import { Activity, Database, Zap, GitBranch, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

interface SystemMetrics {
  status: 'online' | 'degraded' | 'offline'
  uptime: string
  lastCron: string
  commitCount: number
  activeSkills: number
  memoryFiles: number
  sessionCost: string
  model: string
}

interface CronHealth {
  id: string
  name: string
  status: 'green' | 'yellow' | 'red'
  lastStatus: 'ok' | 'error' | 'unknown'
  consecutiveErrors: number
  model: string
}

interface Incident {
  id: string
  jobName: string
  severity: 'yellow' | 'red'
  message: string
  timestamp?: string
}

const DEFAULT_METRICS: SystemMetrics = {
  status: 'online',
  uptime: 'calculating...',
  lastCron: 'checking...',
  commitCount: 0,
  activeSkills: 42,
  memoryFiles: 0,
  sessionCost: '$0.00',
  model: 'loading...'
}

const badgeStyles = {
  green: 'bg-green-900/40 text-green-300 border-green-700',
  yellow: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  red: 'bg-red-900/40 text-red-300 border-red-700'
}

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>(DEFAULT_METRICS)
  const [cronHealth, setCronHealth] = useState<CronHealth[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/system-metrics')
      const data = await response.json()
      if (data.success && data.metrics) {
        setMetrics(data.metrics)
      }
      setCronHealth(data.cronHealth || [])
      setIncidents(data.incidents || [])
    } catch (error) {
      console.error('Failed to fetch system metrics:', error)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const statusColor = {
    online: 'text-green-400',
    degraded: 'text-yellow-400',
    offline: 'text-red-400'
  }[metrics.status]

  const statusIcon = {
    online: <div className="status-indicator status-active"></div>,
    degraded: <div className="status-indicator status-idle"></div>,
    offline: <div className="status-indicator status-offline"></div>
  }[metrics.status]

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-green-300">SYSTEM STATUS</h2>
          {statusIcon}
          <span className={`text-sm font-medium ${statusColor}`}>{metrics.status.toUpperCase()}</span>
        </div>

        <div className="text-right text-sm text-green-500">
          <div>{currentTime.toLocaleDateString()}</div>
          <div className="font-mono">{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-300">{metrics.uptime}</div>
          <div className="text-xs text-gray-400">UPTIME</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <GitBranch className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-300">{metrics.commitCount}</div>
          <div className="text-xs text-gray-400">COMMITS</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-300">{metrics.activeSkills}</div>
          <div className="text-xs text-gray-400">SKILLS</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Database className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-300">{metrics.memoryFiles}</div>
          <div className="text-xs text-gray-400">MEMORIES</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-green-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Last Cron:</span>
            <span className="text-green-400">{metrics.lastCron}</span>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Model:</span>
            <span className="text-green-400 font-mono">{metrics.model}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-300">Session Cost:</span>
            <span className="text-green-400 font-mono">{metrics.sessionCost}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-green-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-green-300">Cron Health</h3>
          <span className="text-xs text-gray-400">{cronHealth.length} active jobs</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {cronHealth.slice(0, 8).map((job) => (
            <span
              key={job.id}
              className={`px-2 py-1 text-xs rounded border ${badgeStyles[job.status]}`}
              title={`${job.name} • ${job.model} • errors: ${job.consecutiveErrors}`}
            >
              {job.name}
            </span>
          ))}
          {cronHealth.length === 0 && <span className="text-xs text-gray-500">No cron data</span>}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-green-800">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-semibold text-green-300">Incident Feed</h3>
        </div>
        {incidents.length === 0 ? (
          <p className="text-xs text-green-400">No active incidents</p>
        ) : (
          <ul className="space-y-1">
            {incidents.map((incident) => (
              <li key={incident.id} className="text-xs text-gray-300">
                <span className={`mr-2 inline-block w-2 h-2 rounded-full ${incident.severity === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                <span className="text-green-300">{incident.jobName}</span> {'->'} {incident.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
