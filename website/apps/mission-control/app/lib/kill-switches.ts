import { readFileSync, writeFileSync, existsSync } from 'fs'

export interface KillSwitchState {
  active: boolean
  reason?: string
  activatedAt?: string
  until?: string
}

export function readKillSwitch(path: string): KillSwitchState {
  if (!existsSync(path)) {
    return { active: false }
  }
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'))
    // Auto-expire if past the until time
    if (data.active && data.until) {
      if (new Date() > new Date(data.until)) {
        data.active = false
      }
    }
    return {
      active: data.active ?? false,
      reason: data.reason,
      activatedAt: data.activated_at ?? data.activatedAt,
      until: data.until,
    }
  } catch {
    return { active: false }
  }
}

export function toggleKillSwitch(path: string, active: boolean, reason?: string): KillSwitchState {
  const now = new Date()
  const until = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  const state = active
    ? {
        active: true,
        reason: reason || 'Manual activation from Mission Control',
        activated_at: now.toISOString(),
        until: until.toISOString(),
      }
    : {
        active: false,
        deactivated_at: now.toISOString(),
        deactivated_reason: reason || 'Manual deactivation from Mission Control',
      }

  writeFileSync(path, JSON.stringify(state, null, 2))
  return readKillSwitch(path)
}
