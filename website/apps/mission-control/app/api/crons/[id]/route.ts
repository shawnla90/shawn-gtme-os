import { NextResponse } from 'next/server'
import { getJobById } from '../../../lib/cron-registry'
import { getJobStatus, getRecentLogs, tailLog } from '../../../lib/launchd'
import { readKillSwitch } from '../../../lib/kill-switches'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const job = getJobById(id)
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  const { status, exitCode, pid } = getJobStatus(job.label, job.plistPath)
  const recentLogs = job.logDir && job.logPattern
    ? getRecentLogs(job.logDir, job.logPattern)
    : []
  const stdout = tailLog(job.stdoutLog || '', 50)
  const stderr = tailLog(job.stderrLog || '', 50)
  const killSwitch = job.killSwitchPath ? readKillSwitch(job.killSwitchPath) : null

  return NextResponse.json({
    id: job.id,
    name: job.name,
    label: job.label,
    system: job.system,
    schedule: job.schedule,
    scriptPath: job.scriptPath,
    status,
    exitCode,
    pid,
    killSwitch,
    recentLogs,
    stdout,
    stderr,
  })
}
