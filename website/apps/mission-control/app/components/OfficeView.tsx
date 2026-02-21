'use client'

import { useState, useEffect } from 'react'
import { Monitor, Coffee, Zap, Users, MousePointer } from 'lucide-react'

interface Agent {
  id: string
  name: string
  role: 'builder' | 'scribe' | 'strategist' | 'alchemist' | 'polymath'
  status: 'working' | 'idle' | 'thinking' | 'break'
  currentTask: string
  workstation: {
    x: number
    y: number
    desk: string
  }
  avatar: string
  mood: string
  lastActivity: string
}

const OFFICE_AGENTS: Agent[] = [
  {
    id: 'nio-commander',
    name: 'Nio',
    role: 'alchemist',
    status: 'working',
    currentTask: 'Commanding AI operations & building systems',
    workstation: { x: 50, y: 15, desk: 'COMMAND CENTER' },
    avatar: '/progression/avatars/nio-tier-2-idle.gif',
    mood: '⚡',
    lastActivity: 'just now'
  },
  {
    id: 'builder-01',
    name: 'Builder',
    role: 'builder',
    status: 'working',
    currentTask: 'Optimizing component architecture',
    workstation: { x: 60, y: 20, desk: 'Dev Station Alpha' },
    avatar: '/progression/avatars/class-builder-idle.gif',
    mood: '🔧',
    lastActivity: '2m ago'
  },
  {
    id: 'scribe-01',
    name: 'Scribe',
    role: 'scribe',
    status: 'thinking',
    currentTask: 'Drafting system documentation',
    workstation: { x: 20, y: 70, desk: 'Content Lab' },
    avatar: '/progression/avatars/class-scribe-idle.gif',
    mood: '📝',
    lastActivity: '5m ago'
  },
  {
    id: 'strategist-01',
    name: 'Strategist',
    role: 'strategist',
    status: 'idle',
    currentTask: 'Planning next sprint objectives',
    workstation: { x: 75, y: 60, desk: 'Strategy Corner' },
    avatar: '/progression/avatars/class-strategist-idle.gif',
    mood: '🧠',
    lastActivity: '12m ago'
  },
  {
    id: 'polymath-01',
    name: 'Polymath',
    role: 'polymath',
    status: 'thinking',
    currentTask: 'Processing multi-domain analysis',
    workstation: { x: 25, y: 55, desk: 'Research Hub' },
    avatar: '/progression/avatars/class-polymath-idle.gif',
    mood: '🧠',
    lastActivity: '8m ago'
  },
  {
    id: 'cursor-slayer',
    name: 'Cursor Slayer',
    role: 'builder',
    status: 'working',
    currentTask: 'Slaying bugs in Cursor IDE',
    workstation: { x: 75, y: 25, desk: 'IDE Station' },
    avatar: '/progression/avatars/class-builder-idle.gif',
    mood: '⚔️',
    lastActivity: '30s ago'
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    role: 'builder',
    status: 'working', 
    currentTask: 'Architecting clean code solutions',
    workstation: { x: 75, y: 45, desk: 'Code Lab' },
    avatar: '/progression/avatars/class-strategist-idle.gif',
    mood: '🔥',
    lastActivity: '1m ago'
  }
]

export default function OfficeView() {
  const [agents, setAgents] = useState<Agent[]>(OFFICE_AGENTS)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showGrid, setShowGrid] = useState(false)

  // Simulate agent activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(currentAgents => 
        currentAgents.map(agent => {
          // Random chance to change status
          if (Math.random() > 0.85) {
            const statuses = ['working', 'idle', 'thinking', 'break'] as const
            const currentIndex = statuses.indexOf(agent.status)
            const newStatus = statuses[(currentIndex + 1) % statuses.length]
            
            return {
              ...agent,
              status: newStatus,
              lastActivity: 'just now',
              mood: newStatus === 'working' ? '⚡' : 
                    newStatus === 'thinking' ? '🧠' : 
                    newStatus === 'break' ? '☕' : '💤'
            }
          }
          return agent
        })
      )
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const statusColors = {
    working: 'border-green-400 bg-green-900/20',
    idle: 'border-blue-400 bg-blue-900/20',
    thinking: 'border-purple-400 bg-purple-900/20',
    break: 'border-yellow-400 bg-yellow-900/20'
  }

  const statusIndicators = {
    working: <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>,
    idle: <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>,
    thinking: <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>,
    break: <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
  }

  const getAgentStats = () => {
    const working = agents.filter(a => a.status === 'working').length
    const idle = agents.filter(a => a.status === 'idle').length
    const thinking = agents.filter(a => a.status === 'thinking').length
    const onBreak = agents.filter(a => a.status === 'break').length
    
    return { working, idle, thinking, onBreak, total: agents.length }
  }

  const stats = getAgentStats()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-green-300">THE OFFICE</h2>
          <div className="flex gap-1">
            <div className="status-indicator status-active"></div>
            <span className="text-xs text-green-500">{stats.working} ACTIVE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-3 py-1 text-xs rounded ${
              showGrid ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
            }`}
          >
            GRID {showGrid ? 'ON' : 'OFF'}
          </button>
          
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {stats.working}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              {stats.thinking}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              {stats.idle}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              {stats.onBreak}
            </span>
          </div>
        </div>
      </div>

      {/* Office Floor Plan */}
      <div className="relative bg-gray-900 border border-green-800 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        {/* Grid overlay */}
        {showGrid && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #10b981 1px, transparent 1px),
                linear-gradient(to bottom, #10b981 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}
        
        {/* Office Elements */}
        <div className="absolute inset-0">
          {/* Command Center Platform */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-16 bg-green-900/30 rounded border-2 border-green-600/50 flex items-center justify-center">
            <div className="text-xs text-green-400 font-bold">COMMAND CENTER</div>
          </div>
          
          {/* Office furniture/layout elements */}
          <div className="absolute top-2 left-2 w-16 h-8 bg-gray-700 rounded border border-gray-600 flex items-center justify-center">
            <Coffee className="w-4 h-4 text-yellow-600" />
          </div>
          
          <div className="absolute bottom-2 right-2 w-12 h-12 bg-gray-700 rounded-full border border-gray-600 flex items-center justify-center">
            <Monitor className="w-6 h-6 text-green-600" />
          </div>
          
          {/* IDE Workstations */}
          <div className="absolute top-16 right-8 w-20 h-12 bg-blue-900/30 rounded border border-blue-600/50 flex items-center justify-center">
            <div className="text-xs text-blue-400">IDE ZONE</div>
          </div>

          {/* Agents at their workstations */}
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${
                selectedAgent?.id === agent.id ? 'ring-2 ring-green-400' : ''
              }`}
              style={{
                left: `${agent.workstation.x}%`,
                top: `${agent.workstation.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedAgent(agent)}
            >
              {/* Agent avatar */}
              <div className={`w-12 h-12 rounded-lg border-2 ${statusColors[agent.status]} relative overflow-hidden`}>
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => {
                    // Fallback to text if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                
                {/* Status indicator */}
                <div className="absolute -top-1 -right-1">
                  {statusIndicators[agent.status]}
                </div>
                
                {/* Mood indicator */}
                <div className="absolute -bottom-1 -left-1 text-xs bg-gray-800 rounded px-1">
                  {agent.mood}
                </div>
              </div>
              
              {/* Desk label */}
              <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                {agent.workstation.desk}
              </div>
              
              {/* Activity indicator */}
              {agent.status === 'working' && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Click hint */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 flex items-center gap-1">
          <MousePointer className="w-3 h-3" />
          Click agents for details
        </div>
      </div>

      {/* Agent Details Panel */}
      {selectedAgent && (
        <div className="mt-4 p-4 bg-gray-800 border border-green-700 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-green-600">
              <img
                src={selectedAgent.avatar}
                alt={selectedAgent.name}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-green-300">{selectedAgent.name}</h3>
                <span className="text-xs px-2 py-1 bg-green-900 rounded text-green-300">
                  {selectedAgent.role.toUpperCase()}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  selectedAgent.status === 'working' ? 'bg-green-900 text-green-300' :
                  selectedAgent.status === 'thinking' ? 'bg-purple-900 text-purple-300' :
                  selectedAgent.status === 'break' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {selectedAgent.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{selectedAgent.currentTask}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div>Station: {selectedAgent.workstation.desk}</div>
                <div>Last activity: {selectedAgent.lastActivity}</div>
                <div>Mood: {selectedAgent.mood}</div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Office Stats */}
      <div className="mt-4 pt-4 border-t border-green-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-300">{stats.working}</div>
            <div className="text-xs text-gray-400">Working</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-300">{stats.thinking}</div>
            <div className="text-xs text-gray-400">Thinking</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-300">{stats.idle}</div>
            <div className="text-xs text-gray-400">Idle</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-300">{stats.onBreak}</div>
            <div className="text-xs text-gray-400">On Break</div>
          </div>
        </div>
      </div>
    </div>
  )
}