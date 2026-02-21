'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Activity, Clock, RefreshCw } from 'lucide-react'

interface NioActivity {
  id: string
  status: 'idle' | 'working' | 'thinking'
  message: string
  task: string
  timestamp: string
  mood: 'focused' | 'curious' | 'accomplished' | 'analyzing'
  sessionInfo?: {
    sessionKey?: string
    activeSubAgents?: number
    currentModel?: string
  }
}

const MOODS = {
  focused: "🎯",
  curious: "🔍", 
  accomplished: "⚡",
  analyzing: "🧠"
}

export default function NioStatus() {
  const [activity, setActivity] = useState<NioActivity>({
    id: Date.now().toString(),
    status: 'working',
    message: "🚀 RSS feed deployed and live! Discord integration v2.0 strategy complete. Infrastructure scaling rapidly!",
    task: "RSS Launch & Discord Prep",
    timestamp: new Date().toISOString(),
    mood: 'accomplished'
  })

  const [isAnimated, setIsAnimated] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch current status from API
  const fetchStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/nio-status')
      const data = await response.json()
      if (data.success && data.activity) {
        setActivity(data.activity)
      }
    } catch (error) {
      console.error('Failed to fetch Nio status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchStatus()
    
    // Refresh every 12 hours (matching cron schedule)
    const interval = setInterval(fetchStatus, 12 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const statusColors = {
    idle: 'text-blue-400',
    working: 'text-green-400',
    thinking: 'text-purple-400'
  }

  const statusDots = {
    idle: <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>,
    working: <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>,
    thinking: <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
  }

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000 / 60)
    if (minutes === 0) return 'now'
    if (minutes === 1) return '1m ago'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1h ago'
    return `${hours}h ago`
  }

  return (
    <div className="card relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-bold text-green-300">NIO STATUS</h2>
          {statusDots[activity.status]}
          <span className={`text-sm font-medium ${statusColors[activity.status]}`}>
            {activity.status.toUpperCase()}
          </span>
        </div>
        
        <button
          onClick={fetchStatus}
          disabled={isLoading}
          className="p-1 hover:bg-gray-800 rounded transition-colors"
          title="Refresh status"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : 'hover:text-green-400'}`} />
        </button>
      </div>

      <div className="flex items-start gap-4">
        {/* Nio Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 border border-green-700">
            {isAnimated ? (
              <img 
                src="/progression/avatars/nio-tier-2-idle.gif" 
                alt="Nio Avatar - Blade Tier"
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
                onError={(e) => {
                  // Fallback to static if animated fails
                  const target = e.target as HTMLImageElement
                  target.src = "/progression/avatars/nio-tier-2-static.png"
                }}
              />
            ) : (
              <img 
                src="/progression/avatars/nio-tier-2-static.png" 
                alt="Nio Avatar - Blade Tier"
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
                onError={(e) => {
                  // Fallback to tier-1 if blade tier fails
                  const target = e.target as HTMLImageElement
                  target.src = "/progression/avatars/nio-tier-1-static.png"
                }}
              />
            )}
          </div>
          
          {/* Animation Toggle */}
          <button
            onClick={() => setIsAnimated(!isAnimated)}
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-800 rounded-full text-xs text-green-300 hover:bg-green-700 transition-colors flex items-center justify-center"
            title={isAnimated ? 'Switch to static' : 'Switch to animated'}
          >
            {isAnimated ? '⏸' : '▶'}
          </button>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1">
          <div className="relative bg-gray-800 border border-green-700 rounded-lg p-3 max-w-xs">
            {/* Speech bubble tail */}
            <div className="absolute left-[-8px] top-4 w-0 h-0 border-t-4 border-b-4 border-r-8 border-t-transparent border-b-transparent border-r-green-700"></div>
            <div className="absolute left-[-6px] top-4 w-0 h-0 border-t-4 border-b-4 border-r-8 border-t-transparent border-b-transparent border-r-gray-800"></div>
            
            <div className="flex items-start gap-2 mb-2">
              <MessageCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-green-200 font-medium">
                {MOODS[activity.mood]} {activity.message}
              </span>
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
              <div className="flex items-center gap-2">
                <span>Task: {activity.task}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3" />
                <span>{getTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status History (mini) */}
      <div className="mt-4 pt-3 border-t border-green-800">
        <div className="flex items-center gap-4 text-xs text-green-500">
          <div>💼 Current: {activity.task}</div>
          <div>🎭 Mood: {activity.mood}</div>
          {activity.sessionInfo?.activeSubAgents !== undefined && (
            <div>🤖 Sub-agents: {activity.sessionInfo.activeSubAgents}</div>
          )}
        </div>
      </div>
    </div>
  )
}