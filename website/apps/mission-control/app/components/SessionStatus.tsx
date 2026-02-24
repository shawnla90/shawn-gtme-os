'use client'

import { useState, useEffect } from 'react'
import { Terminal, Cpu, RefreshCw } from 'lucide-react'

export default function SessionStatus() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold text-green-300">SESSION STATUS</h2>
          <div className="status-indicator status-active"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Cpu className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-300">opus-4.6</div>
          <div className="text-xs text-gray-400">ACTIVE MODEL</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Terminal className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-300">Claude Code</div>
          <div className="text-xs text-gray-400">RUNTIME</div>
        </div>
      </div>

      <div className="bg-gray-800 p-3 rounded border border-green-700 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Subscription:</span>
            <span className="text-green-400 font-mono">Max</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Cron Runtime:</span>
            <span className="text-green-400 font-mono">launchd</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Local Model:</span>
            <span className="text-green-400 text-xs">Qwen 2.5 14B (Ollama)</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">API Model:</span>
            <span className="text-green-400 text-xs">Claude Opus 4 (blog gen)</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-green-800 text-xs text-gray-500">
        system time: {currentTime.toLocaleTimeString()}
      </div>
    </div>
  )
}
