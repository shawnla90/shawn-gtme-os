import { NextResponse } from 'next/server'
import fs from 'fs'

function getTeamFromCrons(): any[] {
  const members: any[] = []

  // Nio is always the commander
  members.push({
    id: 'nio-commander',
    name: 'Nio',
    role: 'commander',
    specialization: 'AI Operations & System Architecture',
    status: 'active',
    currentAssignment: 'Orchestrating all agents and cron jobs',
    skills: ['Leadership', 'System Design', 'Content Strategy', 'Agent Orchestration'],
    level: 6,
    experience: 0,
    performance: { tasksCompleted: 0, successRate: 0, avgResponseTime: '0s' }
  })

  // Read cron jobs as team agents
  try {
    const jobsPath = '/Users/shawnos.ai/.openclaw/cron/jobs.json'
    if (fs.existsSync(jobsPath)) {
      const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
      const jobList = Array.isArray(jobs) ? jobs : jobs.jobs || []

      let totalCompleted = 0
      let totalSuccess = 0

      for (const job of jobList) {
        const lastStatus = job.state?.lastStatus || 'idle'
        const isActive = job.enabled && lastStatus !== 'error'
        const consecutiveErrors = job.state?.consecutiveErrors || 0
        const lastDuration = job.state?.lastDurationMs
          ? `${(job.state.lastDurationMs / 1000).toFixed(1)}s`
          : 'n/a'

        // Determine model being used
        const model = job.payload?.model || 'default'
        const isLocal = model.includes('ollama')

        members.push({
          id: job.id,
          name: job.name || 'Unnamed Agent',
          role: isLocal ? 'scout' : 'builder',
          specialization: `Model: ${model.split('/').pop()}`,
          status: !job.enabled ? 'offline' : lastStatus === 'error' ? 'error' : 'active',
          currentAssignment: job.payload?.message?.substring(0, 80) || 'Scheduled task',
          skills: [
            job.schedule?.kind === 'every' ? `Every ${Math.round((job.schedule.everyMs || 0) / 60000)}m` : 'Scheduled',
            isLocal ? 'Local Model' : 'Cloud API',
            lastStatus === 'ok' ? 'Healthy' : lastStatus
          ],
          level: consecutiveErrors === 0 ? 5 : 3,
          experience: job.state?.lastDurationMs || 0,
          performance: {
            tasksCompleted: lastStatus === 'ok' ? 1 : 0,
            successRate: consecutiveErrors === 0 ? 100 : 0,
            avgResponseTime: lastDuration
          }
        })

        if (lastStatus === 'ok') { totalCompleted++; totalSuccess++ }
        else if (lastStatus !== 'idle') { totalCompleted++ }
      }

      // Update Nio's stats from aggregate
      members[0].performance = {
        tasksCompleted: totalCompleted,
        successRate: totalCompleted > 0 ? Math.round((totalSuccess / totalCompleted) * 100) : 0,
        avgResponseTime: 'orchestrator'
      }
      members[0].experience = totalCompleted * 100
    }
  } catch (e) { /* skip */ }

  return members
}

export async function GET() {
  try {
    const members = getTeamFromCrons()
    const activeMembers = members.filter(m => m.status === 'active').length

    return NextResponse.json({
      success: true,
      team: {
        members,
        stats: {
          totalMembers: members.length,
          activeMembers,
          idleMembers: members.filter(m => m.status === 'offline').length,
          errorMembers: members.filter(m => m.status === 'error').length,
          avgLevel: 5,
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
    const { memberId, assignment, status } = await request.json()
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
