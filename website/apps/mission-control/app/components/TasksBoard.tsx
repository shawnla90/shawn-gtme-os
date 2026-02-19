'use client'

import { useState, useEffect } from 'react'
import { Clock, User, Bot, CheckCircle, Circle, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  assignee: 'shawn' | 'nio'
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  sessionId?: string
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Build Mission Control Dashboard',
    description: 'Create the tasks board, memory viewer, and system status components',
    assignee: 'nio',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2026-02-19T05:00:00Z',
    updatedAt: '2026-02-19T05:30:00Z',
    sessionId: 'current'
  },
  {
    id: '2',
    title: 'Jason Calacanis Outreach',
    description: 'Follow up on the email and post the meta content about shooting our shot',
    assignee: 'shawn',
    status: 'todo',
    priority: 'medium',
    createdAt: '2026-02-18T20:00:00Z',
    updatedAt: '2026-02-18T20:00:00Z'
  },
  {
    id: '3',
    title: 'Upwork Gig Analysis',
    description: 'Find and analyze AI automation gigs in the $2K-5K range',
    assignee: 'nio',
    status: 'blocked',
    priority: 'medium',
    createdAt: '2026-02-18T20:40:00Z',
    updatedAt: '2026-02-18T20:45:00Z'
  },
  {
    id: '4',
    title: 'Recursive Drift Content',
    description: 'Review and publish the LinkedIn/X posts about the methodology',
    assignee: 'shawn',
    status: 'todo',
    priority: 'medium',
    createdAt: '2026-02-19T05:24:00Z',
    updatedAt: '2026-02-19T05:24:00Z'
  }
]

const statusIcons = {
  todo: Circle,
  in_progress: Clock,
  blocked: AlertCircle,
  done: CheckCircle
}

const statusColors = {
  todo: 'text-gray-400',
  in_progress: 'text-yellow-400',
  blocked: 'text-red-400',
  done: 'text-green-400'
}

const priorityColors = {
  low: 'border-l-blue-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500'
}

export default function TasksBoard() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [filter, setFilter] = useState<'all' | 'shawn' | 'nio'>('all')

  const filteredTasks = tasks.filter(task => 
    filter === 'all' || task.assignee === filter
  )

  const taskCounts = {
    total: tasks.length,
    shawn: tasks.filter(t => t.assignee === 'shawn').length,
    nio: tasks.filter(t => t.assignee === 'nio').length,
    active: tasks.filter(t => t.status === 'in_progress').length
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-green-300">TASKS BOARD</h2>
          <div className="flex gap-1">
            <div className="status-indicator status-active"></div>
            <span className="text-xs text-green-500">{taskCounts.active} ACTIVE</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded ${
              filter === 'all' ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
            }`}
          >
            ALL ({taskCounts.total})
          </button>
          <button
            onClick={() => setFilter('shawn')}
            className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
              filter === 'shawn' ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
            }`}
          >
            <User className="w-3 h-3" /> SHAWN ({taskCounts.shawn})
          </button>
          <button
            onClick={() => setFilter('nio')}
            className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
              filter === 'nio' ? 'bg-green-800 text-green-300' : 'bg-gray-800 text-gray-400'
            }`}
          >
            <Bot className="w-3 h-3" /> NIO ({taskCounts.nio})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map(task => {
          const StatusIcon = statusIcons[task.status]
          return (
            <div
              key={task.id}
              className={`bg-gray-800 border-l-4 ${priorityColors[task.priority]} p-4 rounded-r-lg`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon className={`w-4 h-4 ${statusColors[task.status]}`} />
                    <h3 className="font-medium text-green-200">{task.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                      {task.priority.toUpperCase()}
                    </span>
                    {task.sessionId === 'current' && (
                      <span className="text-xs px-2 py-1 bg-green-900 rounded text-green-300">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      {task.assignee === 'shawn' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      <span>{task.assignee.toUpperCase()}</span>
                    </div>
                    <div>Updated: {new Date(task.updatedAt).toLocaleDateString()}</div>
                    <div className={`px-2 py-1 rounded ${statusColors[task.status]} bg-opacity-20`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-green-800">
        <div className="flex items-center gap-4 text-xs text-green-500">
          <div>📊 {taskCounts.total} total tasks</div>
          <div>⚡ {taskCounts.active} active</div>
          <div>🎯 {tasks.filter(t => t.status === 'todo').length} pending</div>
          <div>✅ {tasks.filter(t => t.status === 'done').length} completed</div>
        </div>
      </div>
    </div>
  )
}