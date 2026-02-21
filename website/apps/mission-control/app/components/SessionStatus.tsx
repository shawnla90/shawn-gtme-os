'use client'

import { useState, useEffect } from 'react'
import { Terminal, Cpu, BarChart3, RefreshCw } from 'lucide-react'

type SessionInfo = {
  updatedAt: string
  version: string
  channel: string
  gatewayMode?: string
  defaultModel?: string
  activeSession?: {
    key: string
    kind: string
    model: string
    percentUsed?: number | null
    totalTokens?: number | null
    contextTokens?: number | null
  }
}

export default function SessionStatus() {
  const [sessionData, setSessionData] = useState<SessionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchSessionData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/openclaw-status')
      const data = await response.json()
      if (data.success && data.data) {
        setSessionData(data.data)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch session data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSessionData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchSessionData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A'
    return num.toLocaleString()
  }

  const getUsageColor = (percent: number | null | undefined): string => {
    if (!percent) return 'text-gray-400'
    if (percent < 50) return 'text-green-400'
    if (percent < 80) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSessionTypeLabel = (key: string): string => {
    if (key.includes(':main:main')) return 'MAIN SESSION'
    if (key.includes(':cron:')) return 'CRON SESSION'
    if (key.includes(':discord:')) return 'DISCORD SESSION'
    return 'UNKNOWN SESSION'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold text-green-300">SESSION STATUS</h2>
          <div className="status-indicator status-active"></div>
        </div>
        
        <button
          onClick={fetchSessionData}
          disabled={isLoading}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Refresh session data"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : 'hover:text-green-400'}`} />
        </button>
      </div>

      {sessionData?.activeSession ? (
        <>
          {/* Session Overview */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Cpu className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-300">
                {sessionData.activeSession.model?.replace('openai-codex/', '').replace('anthropic/', '') || 'N/A'}
              </div>
              <div className="text-xs text-gray-400">ACTIVE MODEL</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-4 h-4 text-green-400" />
              </div>
              <div className={`text-2xl font-bold ${getUsageColor(sessionData.activeSession.percentUsed)}`}>
                {sessionData.activeSession.percentUsed || 0}%
              </div>
              <div className="text-xs text-gray-400">CONTEXT USED</div>
            </div>
          </div>

          {/* Usage Details */}
          <div className="bg-gray-800 p-3 rounded border border-green-700 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Tokens:</span>
                <span className="text-green-400 font-mono">
                  {formatNumber(sessionData.activeSession.totalTokens)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Context Limit:</span>
                <span className="text-green-400 font-mono">
                  {formatNumber(sessionData.activeSession.contextTokens)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Session Type:</span>
                <span className="text-green-400 text-xs">
                  {getSessionTypeLabel(sessionData.activeSession.key)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Gateway:</span>
                <span className="text-green-400 text-xs">
                  {sessionData.gatewayMode?.toUpperCase() || 'UNKNOWN'}
                </span>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Token Usage</span>
                <span>{sessionData.activeSession.percentUsed || 0}% of {formatNumber(sessionData.activeSession.contextTokens)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (sessionData.activeSession.percentUsed || 0) < 50 
                      ? 'bg-green-500' 
                      : (sessionData.activeSession.percentUsed || 0) < 80 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(sessionData.activeSession.percentUsed || 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">OpenClaw:</span>
              <span className="text-green-400 font-mono">{sessionData.version}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Channel:</span>
              <span className="text-green-400">{sessionData.channel}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Terminal className="w-8 h-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">
            {isLoading ? 'Loading session data...' : 'No active session data available'}
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-green-800 text-xs text-gray-500">
        snapshot refreshes every 2 hours • last updated {lastUpdated?.toLocaleTimeString() || 'never'}
      </div>
    </div>
  )
}