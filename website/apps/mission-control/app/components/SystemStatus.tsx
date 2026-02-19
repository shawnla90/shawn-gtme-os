'use client'

import { useState, useEffect } from 'react'
import { Activity, Database, Zap, GitBranch, Clock, CheckCircle } from 'lucide-react'

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

const MOCK_METRICS: SystemMetrics = {
  status: 'online',
  uptime: '2d 14h 23m',
  lastCron: '6:00 AM EST (Success)',
  commitCount: 108,
  activeSkills: 42,
  memoryFiles: 18,
  sessionCost: '$2.14',
  model: 'claude-sonnet-4-5'
}

export default function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>(MOCK_METRICS)
  const [currentTime, setCurrentTime] = useState(new Date())

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
          <span className={`text-sm font-medium ${statusColor}`}>
            {metrics.status.toUpperCase()}
          </span>
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
    </div>
  )
}