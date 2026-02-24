import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

function getMetricsData() {
  try {
    const metricsPath = './public/metrics.json'
    if (fs.existsSync(metricsPath)) {
      return JSON.parse(fs.readFileSync(metricsPath, 'utf8'))
    }
    return null
  } catch {
    return null
  }
}

function getCurrentTasks(): Task[] {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const tasks: Task[] = []

  const metrics = getMetricsData()

  // Check metrics and drafts
  if (metrics) {
    if (metrics.drafts && metrics.drafts.length > 3) {
      tasks.push({
        id: 'publish-drafts',
        title: `Publish ${metrics.drafts.length} Pending Drafts`,
        description: `Ready to ship: ${metrics.drafts.slice(0, 3).map((d: any) => d.title.split(' ')[1] || d.title).join(', ')}...`,
        assignee: 'shawn',
        status: 'todo',
        priority: 'high',
        createdAt: yesterday,
        updatedAt: now
      })
    }
  }

  // Add current mission control task if active
  tasks.push({
    id: 'mission-control-enhancement',
    title: 'Mission Control Enhancement',
    description: 'Implementing dynamic task management and real-time status improvements. System-driven task generation active.',
    assignee: 'nio',
    status: 'in_progress',
    priority: 'high',
    createdAt: now,
    updatedAt: now,
    sessionId: 'current'
  })

  // Add system maintenance tasks
  const dayOfWeek = new Date().getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    tasks.push({
      id: 'weekend-system-review',
      title: 'Weekend System Health Review',
      description: 'Weekly system health check: review logs, check disk usage, validate backup systems.',
      assignee: 'nio',
      status: 'todo',
      priority: 'low',
      createdAt: yesterday,
      updatedAt: now
    })
  }

  // Add baseline monitoring task
  tasks.push({
    id: 'system-monitoring',
    title: 'System Monitoring & Health',
    description: 'Continuous monitoring of cron jobs and system metrics via launchd. Auto-refreshed every 5 minutes.',
    assignee: 'nio',
    status: 'in_progress',
    priority: 'medium',
    createdAt: yesterday,
    updatedAt: now
  })

  return tasks
}

export async function GET() {
  try {
    const tasks = getCurrentTasks()

    return NextResponse.json({
      success: true,
      tasks,
      meta: {
        total: tasks.length,
        active: tasks.filter(t => t.status === 'in_progress').length,
        pending: tasks.filter(t => t.status === 'todo').length,
        completed: tasks.filter(t => t.status === 'done').length,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'failed to fetch tasks'
      },
      { status: 500 }
    )
  }
}
