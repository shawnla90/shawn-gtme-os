'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Zap, GitBranch, Users, Bell, ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  type: 'cron' | 'deployment' | 'milestone' | 'system'
  datetime: string
  status: 'completed' | 'scheduled' | 'failed' | 'running'
  description?: string
  metadata?: {
    cronId?: string
    deploymentUrl?: string
    commitHash?: string
    duration?: string
  }
}

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mission Control Deployed 🚀',
    type: 'deployment',
    datetime: '2026-02-19T07:46:00Z',
    status: 'completed',
    description: 'Successfully deployed Mission Control to Vercel with all 10 pages',
    metadata: {
      deploymentUrl: 'https://mission-control-six-smoky.vercel.app',
      commitHash: '3826995',
      duration: '2m 15s'
    }
  },
  {
    id: '2', 
    title: 'Nio Status Update - HYPE MODE! ⚡',
    type: 'cron',
    datetime: '2026-02-19T12:00:00Z',
    status: 'scheduled',
    description: 'Next hype status update: "leveling up the command center today!"',
    metadata: {
      cronId: 'bcd555fc-f9c8-4ff1-a7dc-ccf4f355deec'
    }
  },
  {
    id: '3',
    title: 'Morning Team Briefing 📋',
    type: 'cron', 
    datetime: '2026-02-19T11:00:00Z',
    status: 'completed',
    description: 'Daily morning scan: Slack channels, ClickUp tasks, system health',
    metadata: {
      cronId: 'morning-briefing-id'
    }
  },
  {
    id: '4',
    title: '100+ Commits Milestone 🎯',
    type: 'milestone',
    datetime: '2026-02-18T22:00:00Z', 
    status: 'completed',
    description: 'Hit 108 commits! From zero to full GTM OS in 2 weeks'
  },
  {
    id: '5',
    title: 'Office View Launch 🏢',
    type: 'system',
    datetime: '2026-02-19T07:10:00Z',
    status: 'completed', 
    description: 'Added interactive office with agent workstations and Command Center'
  },
  {
    id: '6',
    title: 'Next Hype Update ⚡',
    type: 'cron',
    datetime: '2026-02-19T18:00:00Z',
    status: 'scheduled',
    description: 'Incoming creative status: "crushing code like a digital warrior!" or similar',
    metadata: {
      cronId: 'bcd555fc-f9c8-4ff1-a7dc-ccf4f355deec'
    }
  },
  {
    id: '7',
    title: 'Team Management System 👥',
    type: 'system', 
    datetime: '2026-02-19T06:30:00Z',
    status: 'completed',
    description: 'Full agent roster with Nio as Commander, performance tracking, role management'
  }
]

const eventTypeIcons = {
  cron: Clock,
  deployment: GitBranch,
  milestone: Zap,
  system: Users
}

const eventTypeColors = {
  cron: 'text-blue-400 border-blue-600',
  deployment: 'text-green-400 border-green-600', 
  milestone: 'text-yellow-400 border-yellow-600',
  system: 'text-purple-400 border-purple-600'
}

const statusColors = {
  completed: 'text-green-400',
  scheduled: 'text-blue-400',
  failed: 'text-red-400',
  running: 'text-yellow-400'
}

const statusIndicators = {
  completed: '✅',
  scheduled: '⏰', 
  failed: '❌',
  running: '🔄'
}

export default function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'timeline'>('timeline')

  // Sort events by datetime (newest first for timeline)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  )

  // Get today's events
  const today = new Date().toDateString()
  const todayEvents = events.filter(event => 
    new Date(event.datetime).toDateString() === today
  )

  // Get upcoming events (next 24 hours)
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.datetime)
    return eventDate > now && eventDate <= tomorrow && event.status === 'scheduled'
  })

  const formatEventTime = (datetime: string) => {
    const date = new Date(datetime)
    const now = new Date()
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (Math.abs(diffHours) < 1) {
      const diffMins = Math.round(diffHours * 60)
      return diffMins > 0 ? `in ${diffMins}m` : `${Math.abs(diffMins)}m ago`
    } else if (Math.abs(diffHours) < 24) {
      const hours = Math.round(diffHours)
      return hours > 0 ? `in ${hours}h` : `${Math.abs(hours)}h ago`
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-green-300">MISSION CALENDAR</h2>
          <Bell className="w-4 h-4 text-yellow-400" />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {events.filter(e => e.status === 'completed').length} Done
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              {events.filter(e => e.status === 'scheduled').length} Scheduled
            </span>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6">
        {(['timeline', 'day', 'week'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === mode ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-300">{todayEvents.length}</div>
          <div className="text-xs text-gray-400">Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-300">{upcomingEvents.length}</div>
          <div className="text-xs text-gray-400">Upcoming</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-300">
            {events.filter(e => e.type === 'deployment').length}
          </div>
          <div className="text-xs text-gray-400">Deployments</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-300">
            {events.filter(e => e.type === 'cron').length}
          </div>
          <div className="text-xs text-gray-400">Cron Jobs</div>
        </div>
      </div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-green-300 mb-4">Recent Activity & Scheduled Events</h3>
          
          {sortedEvents.map(event => {
            const TypeIcon = eventTypeIcons[event.type]
            const isUpcoming = new Date(event.datetime) > new Date()
            
            return (
              <div
                key={event.id}
                className={`bg-gray-800 border-l-4 rounded-r-lg p-4 ${
                  eventTypeColors[event.type].split(' ')[1]
                } ${isUpcoming ? 'bg-opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <TypeIcon className={`w-4 h-4 ${eventTypeColors[event.type].split(' ')[0]}`} />
                      <h4 className="font-medium text-green-200">{event.title}</h4>
                      <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                        {event.type.toUpperCase()}
                      </span>
                      <span className="text-lg">
                        {statusIndicators[event.status]}
                      </span>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-gray-400 mb-3">{event.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatEventTime(event.datetime)}</span>
                      </div>
                      
                      {event.metadata?.duration && (
                        <div>Duration: {event.metadata.duration}</div>
                      )}
                      
                      {event.metadata?.commitHash && (
                        <div className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3" />
                          <span>{event.metadata.commitHash}</span>
                        </div>
                      )}
                      
                      <div className={`px-2 py-1 rounded ${statusColors[event.status]} bg-opacity-20`}>
                        {event.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Upcoming Events Summary */}
      <div className="mt-6 pt-4 border-t border-green-800">
        <h4 className="text-sm font-medium text-green-400 mb-2">Next Scheduled Events:</h4>
        <div className="space-y-1 text-xs text-gray-300">
          {upcomingEvents.slice(0, 3).map(event => (
            <div key={event.id} className="flex items-center gap-2">
              <span>{statusIndicators.scheduled}</span>
              <span>{event.title}</span>
              <span className="text-gray-500">- {formatEventTime(event.datetime)}</span>
            </div>
          ))}
          {upcomingEvents.length === 0 && (
            <div className="text-gray-500">No scheduled events in the next 24 hours</div>
          )}
        </div>
      </div>
    </div>
  )
}