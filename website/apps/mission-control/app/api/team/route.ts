import { NextResponse } from 'next/server'
import fs from 'fs'

function getTeamRoster(): any[] {
  const members: any[] = []

  // Read cron jobs to figure out what each model is doing
  let cronJobs: any[] = []
  try {
    const jobsPath = '/Users/shawnos.ai/.openclaw/cron/jobs.json'
    if (fs.existsSync(jobsPath)) {
      const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
      cronJobs = Array.isArray(jobs) ? jobs : jobs.jobs || []
    }
  } catch (e) { /* skip */ }

  // Helper: get cron stats for a model
  const getModelCronStats = (modelMatch: string) => {
    const jobs = cronJobs.filter(j => {
      const m = j.payload?.model || 'default'
      return m.includes(modelMatch)
    })
    const okJobs = jobs.filter(j => j.state?.lastStatus === 'ok')
    const totalDuration = jobs.reduce((sum: number, j: any) => sum + (j.state?.lastDurationMs || 0), 0)
    return {
      assignedCrons: jobs.length,
      activeCrons: jobs.filter(j => j.enabled).length,
      successCount: okJobs.length,
      totalJobs: jobs.length,
      avgDuration: jobs.length > 0 ? `${(totalDuration / jobs.length / 1000).toFixed(1)}s` : 'n/a',
      jobNames: jobs.map((j: any) => j.name).filter(Boolean)
    }
  }

  // 1. Nio - Commander (Sonnet, main chat agent)
  const sonnetCrons = getModelCronStats('sonnet')
  const defaultCrons = cronJobs.filter(j => !j.payload?.model || j.payload.model.includes('sonnet'))
  members.push({
    id: 'nio',
    name: 'Nio',
    role: 'commander',
    model: 'Claude Sonnet 4',
    provider: 'Anthropic API',
    specialization: 'Main agent — chat, WhatsApp, Discord, orchestration',
    status: 'active',
    currentAssignment: 'Handling all conversations and agent coordination',
    skills: ['Chat', 'WhatsApp', 'Discord', 'Orchestration', 'Memory Management'],
    level: 6,
    experience: sonnetCrons.successCount * 100,
    performance: {
      tasksCompleted: sonnetCrons.successCount,
      assignedCrons: defaultCrons.length,
      successRate: sonnetCrons.totalJobs > 0 ? Math.round((sonnetCrons.successCount / sonnetCrons.totalJobs) * 100) : 100,
      avgResponseTime: sonnetCrons.avgDuration,
      cost: 'API pay-per-use'
    }
  })

  // 2. Qwen 2.5 14B - Scout (local Ollama, cron workhorse)
  const ollamaCrons = getModelCronStats('ollama')
  members.push({
    id: 'qwen-local',
    name: 'Qwen 2.5 14B',
    role: 'scout',
    model: 'qwen2.5:14b',
    provider: 'Ollama (local)',
    specialization: 'High-frequency cron jobs — commit tracking, RSS, mission control, status updates',
    status: ollamaCrons.activeCrons > 0 ? 'active' : 'idle',
    currentAssignment: ollamaCrons.jobNames.join(', ') || 'Awaiting cron schedule',
    skills: ['Commit Tracking', 'RSS Monitoring', 'Mission Control Updates', 'Status Reports'],
    level: 4,
    experience: ollamaCrons.successCount * 50,
    performance: {
      tasksCompleted: ollamaCrons.successCount,
      assignedCrons: ollamaCrons.assignedCrons,
      successRate: ollamaCrons.totalJobs > 0 ? Math.round((ollamaCrons.successCount / ollamaCrons.totalJobs) * 100) : 100,
      avgResponseTime: ollamaCrons.avgDuration,
      cost: 'FREE (local)'
    }
  })

  // 3. Claude Opus 4 - Architect (content creation, blog generator)
  const opusCrons = getModelCronStats('opus')
  members.push({
    id: 'opus',
    name: 'Claude Opus 4',
    role: 'strategist',
    model: 'claude-opus-4-20250514',
    provider: 'Anthropic API',
    specialization: 'Content creation — blog posts, Substack essays, LinkedIn, deep thinking',
    status: opusCrons.activeCrons > 0 ? 'active' : 'standby',
    currentAssignment: opusCrons.jobNames.join(', ') || 'On-demand content creation',
    skills: ['Blog Writing', 'Substack Essays', 'LinkedIn Posts', 'Deep Analysis', 'Voice DNA'],
    level: 7,
    experience: opusCrons.successCount * 200,
    performance: {
      tasksCompleted: opusCrons.successCount,
      assignedCrons: opusCrons.assignedCrons,
      successRate: opusCrons.totalJobs > 0 ? Math.round((opusCrons.successCount / opusCrons.totalJobs) * 100) : 100,
      avgResponseTime: opusCrons.avgDuration,
      cost: 'API pay-per-use (premium)'
    }
  })

  // 4. Claude Code - Silent Gatekeeper (Max subscription, CLI)
  members.push({
    id: 'claude-code',
    name: 'Claude Code',
    role: 'builder',
    model: 'Claude Opus 4.6',
    provider: 'Max Subscription',
    specialization: 'Silent gatekeeper — infrastructure, debugging, deployments, system fixes',
    status: 'active',
    currentAssignment: 'Watching over the system from the CLI',
    skills: ['Infrastructure', 'Debugging', 'Git Operations', 'Deployments', 'System Architecture'],
    level: 7,
    experience: 9999,
    performance: {
      tasksCompleted: 0,
      assignedCrons: 0,
      successRate: 100,
      avgResponseTime: 'instant',
      cost: 'FREE (Max sub)'
    }
  })

  return members
}

export async function GET() {
  try {
    const members = getTeamRoster()
    const activeMembers = members.filter(m => m.status === 'active').length

    return NextResponse.json({
      success: true,
      team: {
        members,
        stats: {
          totalMembers: members.length,
          activeMembers,
          idleMembers: members.filter(m => m.status === 'idle' || m.status === 'standby').length,
          totalCrons: members.reduce((sum, m) => sum + (m.performance.assignedCrons || 0), 0),
          totalTasksCompleted: members.reduce((sum, m) => sum + m.performance.tasksCompleted, 0),
          avgSuccessRate: Math.round(members.reduce((sum, m) => sum + m.performance.successRate, 0) / members.length)
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get team data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get team data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { memberId } = await request.json()
    return NextResponse.json({
      success: true,
      message: `Team member ${memberId} updated`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}
