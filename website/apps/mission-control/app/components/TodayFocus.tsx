'use client'

import { useEffect, useMemo, useState } from 'react'
import { Target, AlertCircle, ArrowRight } from 'lucide-react'

interface Todo {
  task: string
  time: string
  priority: 'high' | 'medium' | 'low' | string
}

interface Incident {
  id: string
  jobName: string
  severity: 'yellow' | 'red'
  message: string
}

const confidenceClass = {
  high: 'text-green-300 border-green-700 bg-green-900/30',
  medium: 'text-yellow-300 border-yellow-700 bg-yellow-900/30',
  low: 'text-red-300 border-red-700 bg-red-900/30'
}

export default function TodayFocus() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [runningPipeline, setRunningPipeline] = useState(false)

  const load = async () => {
    try {
      const [enhancedRes, metricsRes] = await Promise.all([
        fetch('/api/enhanced-data'),
        fetch('/api/system-metrics')
      ])

      const enhanced = await enhancedRes.json()
      const metrics = await metricsRes.json()

      setTodos((enhanced?.data?.todos || []).slice(0, 3))
      setIncidents(metrics?.incidents || [])
    } catch (e) {
      console.error('Today focus load failed', e)
    }
  }

  const runPipeline = async () => {
    setRunningPipeline(true)
    try {
      const res = await fetch('/api/ops/pipeline', { method: 'POST' })
      const data = await res.json()
      if (!data.success) {
        console.error('Pipeline run failed', data.error)
      }
      await load()
    } catch (e) {
      console.error('Pipeline trigger failed', e)
    } finally {
      setRunningPipeline(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const topBlocker = useMemo(() => {
    const red = incidents.find((i) => i.severity === 'red')
    if (red) return `${red.jobName}: ${red.message}`

    const yellow = incidents.find((i) => i.severity === 'yellow')
    if (yellow) return `${yellow.jobName}: ${yellow.message}`

    return 'No active blockers'
  }, [incidents])

  const nextAction = useMemo(() => {
    if (incidents.some((i) => i.severity === 'red')) return 'Fix red cron incident and force-run failed job'
    if (todos.length > 0) return `Execute top priority: ${todos[0].task}`
    return 'Run updater + metrics + validation pipeline'
  }, [incidents, todos])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold text-green-300">TODAY FOCUS</h2>
        </div>
        <button
          onClick={runPipeline}
          disabled={runningPipeline}
          className="text-xs px-2 py-1 rounded border border-green-700 text-green-300 hover:bg-green-900/30 disabled:opacity-60"
        >
          {runningPipeline ? 'Running…' : 'Run Pipeline'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-green-800 rounded p-3">
          <h3 className="text-sm text-green-400 mb-2">Top 3 Priorities</h3>
          <ul className="space-y-1 text-sm text-gray-200">
            {todos.length === 0 && <li>• No priorities loaded</li>}
            {todos.map((t, idx) => (
              <li key={`${t.task}-${idx}`}>• {t.task}</li>
            ))}
          </ul>
          <span className={`mt-3 inline-block px-2 py-1 text-xs border rounded ${confidenceClass.high}`}>
            confidence: high (enhanced-data)
          </span>
        </div>

        <div className="bg-gray-900/50 border border-green-800 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm text-green-400">Current Blocker</h3>
          </div>
          <p className="text-sm text-gray-200">{topBlocker}</p>
          <span className={`mt-3 inline-block px-2 py-1 text-xs border rounded ${incidents.length ? confidenceClass.high : confidenceClass.medium}`}>
            confidence: {incidents.length ? 'high' : 'medium'} (cron incidents)
          </span>
        </div>

        <div className="bg-gray-900/50 border border-green-800 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-green-400" />
            <h3 className="text-sm text-green-400">Next Action</h3>
          </div>
          <p className="text-sm text-gray-200">{nextAction}</p>
          <span className={`mt-3 inline-block px-2 py-1 text-xs border rounded ${confidenceClass.medium}`}>
            confidence: medium (rule-based)
          </span>
        </div>
      </div>
    </div>
  )
}
