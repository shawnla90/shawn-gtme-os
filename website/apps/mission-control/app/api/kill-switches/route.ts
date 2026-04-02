import { NextResponse } from 'next/server'
import { CRON_REGISTRY } from '../../lib/cron-registry'
import { readKillSwitch, toggleKillSwitch } from '../../lib/kill-switches'

export const dynamic = 'force-dynamic'

export async function GET() {
  const switches: Record<string, any> = {}

  for (const job of CRON_REGISTRY) {
    if (job.killSwitchPath) {
      switches[job.system] = {
        ...readKillSwitch(job.killSwitchPath),
        path: job.killSwitchPath,
        system: job.system,
      }
    }
  }

  return NextResponse.json(switches)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { system, active, reason } = body

  // Find the kill switch path for this system
  const job = CRON_REGISTRY.find((j) => j.system === system && j.killSwitchPath)
  if (!job || !job.killSwitchPath) {
    return NextResponse.json({ error: 'No kill switch for this system' }, { status: 400 })
  }

  const result = toggleKillSwitch(job.killSwitchPath, active, reason)
  return NextResponse.json({ success: true, ...result })
}
