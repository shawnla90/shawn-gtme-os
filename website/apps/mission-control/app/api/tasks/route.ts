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

function getCronJobsPath() {
  const cronRoot = process.env.OPENCLAW_CRON || '/Users/shawnos.ai/.openclaw/cron'
  return path.join(cronRoot, 'jobs.json')
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

function getMemoryFileCount() {
  try {
    const memoryDir = path.join(process.env.OPENCLAW_WORKSPACE_DIR || '/Users/shawnos.ai/.openclaw/workspace', 'memory')
    if (fs.existsSync(memoryDir)) {
      return fs.readdirSync(memoryDir).filter(f => f.endsWith('.md')).length
    }
    return 0
  } catch {
    return 0
  }
}

function getCurrentTasks(): Task[] {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const tasks: Task[] = []

  // Get real system data
  const metrics = getMetricsData()
  const memoryFileCount = getMemoryFileCount()
  
  // Check cron job health
  try {
    const cronPath = getCronJobsPath()
    if (fs.existsSync(cronPath)) {
      const cronData = JSON.parse(fs.readFileSync(cronPath, 'utf8'))
      const jobs = Array.isArray(cronData) ? cronData : cronData.jobs || []
      
      const failedJobs = jobs.filter((job: any) => 
        job.enabled && 
        job.state?.lastStatus === 'error' && 
        (job.state?.consecutiveErrors || 0) >= 2
      )

      if (failedJobs.length > 0) {
        tasks.push({
          id: 'cron-health-critical',
          title: `Critical: ${failedJobs.length} Cron Jobs Failing`,
          description: `Failed jobs: ${failedJobs.map((j: any) => j.name || j.id).join(', ')}. Check logs and restart systems as needed.`,
          assignee: 'nio',
          status: 'blocked',
          priority: 'high',
          createdAt: yesterday,
          updatedAt: now,
          sessionId: 'system-generated'
        })
      }

      const enabledJobs = jobs.filter((job: any) => job.enabled).length
      const disabledJobs = jobs.filter((job: any) => !job.enabled).length
      
      if (disabledJobs > enabledJobs) {
        tasks.push({
          id: 'cron-disabled-review',
          title: 'Review Disabled Cron Jobs',
          description: `${disabledJobs} disabled vs ${enabledJobs} enabled jobs. Review disabled jobs for potential re-enablement.`,
          assignee: 'shawn',
          status: 'todo',
          priority: 'medium',
          createdAt: yesterday,
          updatedAt: now
        })
      }
    }
  } catch (error) {
    console.error('Error reading cron data:', error)
  }

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

    // Check memory file growth
    if (memoryFileCount > 7) {
      tasks.push({
        id: 'memory-consolidation',
        title: 'Memory System Consolidation',
        description: `${memoryFileCount} memory files detected. Review and consolidate key insights to MEMORY.md.`,
        assignee: 'nio',
        status: 'todo',
        priority: 'medium',
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
  if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
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
    description: 'Continuous monitoring of OpenClaw status, cron jobs, and system metrics. Auto-refreshed every 5 minutes.',
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