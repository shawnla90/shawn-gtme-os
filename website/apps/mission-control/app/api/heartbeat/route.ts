import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const STATUS_FILE = path.resolve(process.cwd(), '../../..', '.hypernovum-status.json')
const STALE_THRESHOLD_MS = 5 * 60 * 1000 // 5 minutes

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!fs.existsSync(STATUS_FILE)) {
      return NextResponse.json({ active: false, reason: 'no-status-file' })
    }

    const raw = fs.readFileSync(STATUS_FILE, 'utf-8')
    const status = JSON.parse(raw)

    // Check if the heartbeat is stale
    const lastActivity = new Date(status.lastActivity).getTime()
    const now = Date.now()
    const isActive = now - lastActivity < STALE_THRESHOLD_MS

    return NextResponse.json({
      ...status,
      active: isActive,
      staleSince: isActive ? null : status.lastActivity,
    })
  } catch {
    return NextResponse.json({ active: false, reason: 'read-error' })
  }
}
