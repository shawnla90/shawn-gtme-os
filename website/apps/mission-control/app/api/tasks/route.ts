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

function getCurrentTasks(): Task[] {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  return [
    {
      id: 'blog-quality-qa',
      title: 'Blog Quality QA',
      description: 'Review last 2 nio.terminal posts - missing gaps section, using hype language. Fix canonical structure.',
      assignee: 'nio',
      status: 'todo',
      priority: 'high',
      createdAt: yesterday,
      updatedAt: now,
      sessionId: 'current'
    },
    {
      id: 'cron-health-monitor',
      title: 'Cron Job Health Monitoring',
      description: 'Daily check of ~/.openclaw/cron/jobs.json for failed runs. Currently 3 enabled, 9 disabled.',
      assignee: 'nio',
      status: 'in_progress',
      priority: 'medium',
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'memory-system-enhancement',
      title: 'Memory System Enhancement',
      description: 'Scan memory/YYYY-MM-DD.md files for insights worth promoting to MEMORY.md. Improve knowledge graph.',
      assignee: 'nio',
      status: 'todo',
      priority: 'medium',
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'rss-feed-monitoring',
      title: 'RSS Feed to Discord Announcer',
      description: 'Monitor RSS to Discord announcer cron (runs every 1h). Ensure smooth delivery to Discord channel.',
      assignee: 'nio',
      status: 'done',
      priority: 'low',
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'mission-control-improvements',
      title: 'Mission Control Feature Updates',
      description: 'Page-by-page improvements: Nio status, recent memories, tasks board accuracy. Replace outdated tasks.',
      assignee: 'nio',
      status: 'in_progress',
      priority: 'high',
      createdAt: now,
      updatedAt: now,
      sessionId: 'current'
    },
    {
      id: 'substack-drafts-review',
      title: 'Review Queued Substack Drafts',
      description: 'Confirm: publish queued Substack drafts (5 sitting idle). List drafts, pick 1-2 to ship.',
      assignee: 'shawn',
      status: 'todo',
      priority: 'medium',
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'v3-scoring-engine',
      title: 'Re-enable V3 Scoring Engine Cron',
      description: 'Confirm: re-enable V3 scoring engine cron (currently disabled). Identify why disabled, verify output.',
      assignee: 'shawn',
      status: 'todo',
      priority: 'low',
      createdAt: yesterday,
      updatedAt: now
    },
    {
      id: 'discord-integration',
      title: 'Discord Integration Monitoring',
      description: 'Verify NioBot connection stability. Check channel 1474174694025330919 for proper message flow.',
      assignee: 'nio',
      status: 'done',
      priority: 'low',
      createdAt: yesterday,
      updatedAt: now
    }
  ]
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