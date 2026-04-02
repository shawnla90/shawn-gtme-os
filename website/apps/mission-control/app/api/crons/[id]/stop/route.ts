import { NextResponse } from 'next/server'
import { getJobById } from '../../../../lib/cron-registry'
import { unloadJob } from '../../../../lib/launchd'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const job = getJobById(id)
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  if (!job.plistPath) return NextResponse.json({ error: 'No plist (crontab job)' }, { status: 400 })

  const result = unloadJob(job.plistPath)
  return NextResponse.json({ success: result === 'ok', result })
}
