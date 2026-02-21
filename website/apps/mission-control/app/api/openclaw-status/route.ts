import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'

type OpenClawStatusSnapshot = {
  updatedAt: string
  version: string
  channel: string
  gatewayMode?: string
  defaultModel?: string
  activeSession?: {
    key: string
    kind: string
    model: string
    percentUsed?: number | null
    totalTokens?: number | null
    contextTokens?: number | null
  }
}

function getStateDir() {
  return process.env.OPENCLAW_STATE_DIR || '/Users/shawnos.ai/.openclaw'
}

function getCachePath() {
  return path.join(getStateDir(), 'cache', 'openclaw-status.json')
}

function readCache(maxAgeMs: number): OpenClawStatusSnapshot | null {
  try {
    const cachePath = getCachePath()
    if (!fs.existsSync(cachePath)) return null

    const stat = fs.statSync(cachePath)
    if (Date.now() - stat.mtimeMs > maxAgeMs) return null

    return JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  } catch {
    return null
  }
}

function writeCache(snapshot: OpenClawStatusSnapshot) {
  const cachePath = getCachePath()
  fs.mkdirSync(path.dirname(cachePath), { recursive: true })
  fs.writeFileSync(cachePath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')
}

function buildSnapshot(): OpenClawStatusSnapshot {
  const version = execFileSync('openclaw', ['--version'], { encoding: 'utf8', timeout: 15000 }).trim()
  const statusRaw = execFileSync('openclaw', ['status', '--json'], { encoding: 'utf8', timeout: 30000 })
  const status = JSON.parse(statusRaw)

  const defaults = status?.sessions?.defaults || {}
  const recent = Array.isArray(status?.sessions?.recent) ? status.sessions.recent : []
  const active = recent.find((s: any) => s?.key === 'agent:main:main') || recent[0]

  return {
    updatedAt: new Date().toISOString(),
    version,
    channel: status?.updateChannel || 'unknown',
    gatewayMode: status?.gateway?.mode,
    defaultModel: defaults?.model,
    activeSession: active
      ? {
          key: active.key,
          kind: active.kind,
          model: active.model,
          percentUsed: active.percentUsed ?? null,
          totalTokens: active.totalTokens ?? null,
          contextTokens: active.contextTokens ?? null
        }
      : undefined
  }
}

export async function GET() {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000

  try {
    const cached = readCache(TWO_HOURS_MS)
    if (cached) {
      return NextResponse.json({ success: true, cached: true, data: cached })
    }

    const snapshot = buildSnapshot()
    writeCache(snapshot)

    return NextResponse.json({ success: true, cached: false, data: snapshot })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'failed to read openclaw status'
      },
      { status: 500 }
    )
  }
}
