import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import fs from 'fs'

function getRecentCommits(): any[] {
  try {
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    const output = execSync(
      `git log --since="${since}" --pretty=format:"%H|%s|%aI" --max-count=15`,
      { cwd: '/Users/shawnos.ai/shawn-gtme-os', encoding: 'utf8' }
    )
    return output.split('\n').filter(Boolean).map((line, i) => {
      const [hash, message, date] = line.split('|')
      const isFeat = message.startsWith('feat:')
      const isFix = message.startsWith('fix:')
      return {
        id: `commit-${hash?.substring(0, 7)}`,
        title: message?.substring(0, 60) || 'commit',
        type: isFeat ? 'milestone' : isFix ? 'deployment' : 'system',
        datetime: date,
        status: 'completed',
        description: message,
        metadata: { commitHash: hash?.substring(0, 7) }
      }
    })
  } catch (e) {
    return []
  }
}

function getCronSchedule(): any[] {
  const events: any[] = []
  try {
    const jobsPath = '/Users/shawnos.ai/.openclaw/cron/jobs.json'
    if (fs.existsSync(jobsPath)) {
      const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf8'))
      const jobList = Array.isArray(jobs) ? jobs : jobs.jobs || []
      for (const job of jobList) {
        if (!job.enabled) continue
        const nextRun = job.state?.nextRunAtMs
        const lastRun = job.state?.lastRunAtMs
        const lastStatus = job.state?.lastStatus

        if (nextRun) {
          events.push({
            id: `cron-next-${job.id}`,
            title: job.name || 'Cron Job',
            type: 'cron',
            datetime: new Date(nextRun).toISOString(),
            status: 'scheduled',
            description: `Next run scheduled`,
            metadata: { cronId: job.id, duration: job.state?.lastDurationMs ? `${Math.round(job.state.lastDurationMs / 1000)}s` : undefined }
          })
        }
        if (lastRun) {
          events.push({
            id: `cron-last-${job.id}`,
            title: job.name || 'Cron Job',
            type: 'cron',
            datetime: new Date(lastRun).toISOString(),
            status: lastStatus === 'ok' ? 'completed' : lastStatus === 'error' ? 'failed' : 'completed',
            description: `Last run: ${lastStatus}`,
            metadata: { cronId: job.id, duration: job.state?.lastDurationMs ? `${Math.round(job.state.lastDurationMs / 1000)}s` : undefined }
          })
        }
      }
    }
  } catch (e) { /* skip */ }
  return events
}

export async function GET() {
  try {
    const commits = getRecentCommits()
    const crons = getCronSchedule()
    const allEvents = [...commits, ...crons].sort((a, b) =>
      new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    )

    return NextResponse.json({
      success: true,
      calendar: {
        events: allEvents,
        stats: {
          totalEvents: allEvents.length,
          completedEvents: allEvents.filter(e => e.status === 'completed').length,
          scheduledEvents: allEvents.filter(e => e.status === 'scheduled').length,
          deploymentsThisWeek: commits.length,
          upcomingCronJobs: crons.filter(e => e.status === 'scheduled').length
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get calendar data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get calendar data' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { eventType, title, datetime, description } = await request.json()
    const newEvent = {
      id: Date.now().toString(),
      title,
      type: eventType,
      datetime,
      status: 'scheduled',
      description,
      metadata: {}
    }
    return NextResponse.json({ success: true, event: newEvent })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to add calendar event' },
      { status: 500 }
    )
  }
}
