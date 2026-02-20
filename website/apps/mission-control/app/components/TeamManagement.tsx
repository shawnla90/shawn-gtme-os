'use client'

import { useState, useEffect } from 'react'
import { Users, Settings, Crown, Code, Pen, Brain, Sparkles, Shield } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: 'commander' | 'builder' | 'scribe' | 'strategist' | 'polymath' | 'scout'
  specialization: string
  status: 'active' | 'idle' | 'offline' | 'error'
  currentAssignment?: string
  skills: string[]
  level: number
  experience: number
  avatar?: string
  lastActive?: string
  performance: {
    tasksCompleted: number
    successRate: number
    avgResponseTime: string
  }
}

const roleIcons: Record<string, any> = {
  commander: Crown,
  builder: Code,
  scribe: Pen,
  strategist: Brain,
  polymath: Sparkles,
  scout: Shield
}

const roleColors: Record<string, string> = {
  commander: 'text-yellow-400 border-yellow-600',
  builder: 'text-blue-400 border-blue-600',
  scribe: 'text-green-400 border-green-600',
  strategist: 'text-purple-400 border-purple-600',
  polymath: 'text-pink-400 border-pink-600',
  scout: 'text-cyan-400 border-cyan-600'
}

const statusColors: Record<string, string> = {
  active: 'text-green-400',
  idle: 'text-yellow-400',
  offline: 'text-red-400',
  error: 'text-red-500'
}

export default function TeamManagement() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [filterRole, setFilterRole] = useState<string>('all')

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team')
        const data = await res.json()
        if (data.success && data.team?.members?.length > 0) {
          setTeam(data.team.members)
        }
      } catch (e) {
        console.error('Failed to fetch team:', e)
      }
    }
    fetchTeam()
    const interval = setInterval(fetchTeam, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredTeam = team.filter(member => 
    filterRole === 'all' || member.role === filterRole
  )

  const teamStats = {
    total: team.length,
    active: team.filter(m => m.status === 'active').length,
    idle: team.filter(m => m.status === 'idle').length,
    avgLevel: Math.round(team.reduce((sum, m) => sum + m.level, 0) / team.length),
    totalTasks: team.reduce((sum, m) => sum + m.performance.tasksCompleted, 0)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-green-300">TEAM MANAGEMENT</h2>
          <Shield className="w-4 h-4 text-yellow-400" />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {teamStats.active} Active
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              {teamStats.idle} Idle
            </span>
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{teamStats.total}</div>
          <div className="text-xs text-gray-400">Team Members</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{teamStats.active}</div>
          <div className="text-xs text-gray-400">Active Now</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">Lv.{teamStats.avgLevel}</div>
          <div className="text-xs text-gray-400">Avg Level</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{teamStats.totalTasks}</div>
          <div className="text-xs text-gray-400">Tasks Done</div>
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', ...Array.from(new Set(team.map(m => m.role)))].map(role => (
          <button
            key={role}
            onClick={() => setFilterRole(role)}
            className={`px-3 py-1 text-xs rounded ${
              filterRole === role ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {role === 'all' ? 'ALL' : role.toUpperCase()}
            {role !== 'all' && (
              <span className="ml-1">
                ({team.filter(m => m.role === role).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredTeam.map(member => {
          const RoleIcon = roleIcons[member.role]
          return (
            <div
              key={member.id}
              className={`bg-gray-800 border rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-750 ${
                selectedMember?.id === member.id ? 'ring-2 ring-green-400' : 'border-gray-700'
              } ${member.role === 'commander' ? 'border-yellow-600 bg-yellow-900/10' : ''}`}
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-gray-700 ${roleColors[member.role] || 'text-gray-400 border-gray-600'}`}>
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                    ) : (
                      <span className="text-lg">{(roleIcons[member.role] || Shield) === Crown ? '👑' : '🤖'}</span>
                    )}
                  </div>
                  {member.role === 'commander' && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-green-200 truncate">{member.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${statusColors[member.status]}`}></div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <RoleIcon className={`w-3 h-3 ${roleColors[member.role].split(' ')[0]}`} />
                    <span className="text-xs text-gray-400 truncate">{member.specialization}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-1 py-0.5 bg-gray-700 rounded text-gray-300">
                      Lv.{member.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {member.performance.successRate}% success
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="bg-gray-800 border border-green-700 rounded-lg p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex items-center justify-center bg-gray-700 ${roleColors[selectedMember.role] || 'text-gray-400 border-gray-600'}`}>
                {selectedMember.avatar ? (
                  <img src={selectedMember.avatar} alt={selectedMember.name} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                ) : (
                  <span className="text-3xl">{selectedMember.role === 'commander' ? '👑' : '🤖'}</span>
                )}
              </div>
              {selectedMember.role === 'commander' && (
                <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-green-300">{selectedMember.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${statusColors[selectedMember.status]} bg-opacity-20`}>
                  {selectedMember.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-4">{selectedMember.specialization}</p>
              
              {selectedMember.currentAssignment && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-green-400 mb-1">Current Assignment:</h4>
                  <p className="text-sm text-gray-300">{selectedMember.currentAssignment}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedMember.skills.map(skill => (
                      <span key={skill} className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-2">Performance:</h4>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div>Tasks: {selectedMember.performance.tasksCompleted}</div>
                    <div>Success Rate: {selectedMember.performance.successRate}%</div>
                    <div>Response Time: {selectedMember.performance.avgResponseTime}</div>
                    <div>Experience: {selectedMember.experience} XP</div>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedMember(null)}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}