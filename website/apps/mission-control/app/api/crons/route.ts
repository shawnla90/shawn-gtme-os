import { NextResponse } from 'next/server'
import { CRON_REGISTRY, SYSTEM_LABELS } from '../../lib/cron-registry'
import { getLoadedServices, getJobStatus, getLastRunTime } from '../../lib/launchd'
import { readKillSwitch } from '../../lib/kill-switches'

export const dynamic = 'force-dynamic'

export async function GET() {
  const services = getLoadedServices()

  const jobs = CRON_REGISTRY.map((job) => {
    const { status, exitCode, pid } = getJobStatus(job.label, job.plistPath, services)
    const lastRun = getLastRunTime(job.logDir, job.logPattern)
    const killSwitch = job.killSwitchPath ? readKillSwitch(job.killSwitchPath) : null

    return {
      id: job.id,
      name: job.name,
      system: job.system,
      schedule: job.schedule,
      status,
      exitCode,
      pid,
      lastRun,
      killSwitch: killSwitch ? { active: killSwitch.active, reason: killSwitch.reason } : null,
    }
  })

  // Group by system
  const grouped: Record<string, { label: string; jobs: typeof jobs }> = {}
  for (const [key, label] of Object.entries(SYSTEM_LABELS)) {
    const systemJobs = jobs.filter((j) => j.system === key)
    if (systemJobs.length > 0) {
      grouped[key] = { label, jobs: systemJobs }
    }
  }

  return NextResponse.json({
    systems: grouped,
    total: jobs.length,
    active: jobs.filter((j) => j.status === 'running' || j.status === 'loaded').length,
    timestamp: new Date().toISOString(),
  })
}
