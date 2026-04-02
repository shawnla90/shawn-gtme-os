import { NextResponse } from 'next/server'
import { getJobById } from '../../../../lib/cron-registry'
import { runJobOnce } from '../../../../lib/launchd'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const job = getJobById(id)
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  const { pid } = runJobOnce(job.scriptPath)
  return NextResponse.json({ success: true, pid, script: job.scriptPath })
}
