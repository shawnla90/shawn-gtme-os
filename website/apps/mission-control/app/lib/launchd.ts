import { execSync, spawn } from 'child_process'
import { existsSync, statSync, readdirSync, readFileSync } from 'fs'

export type JobStatus = 'running' | 'loaded' | 'stopped' | 'error' | 'crontab'

interface ServiceInfo {
  pid: number | null
  exitCode: number
}

export function getLoadedServices(): Map<string, ServiceInfo> {
  const services = new Map<string, ServiceInfo>()
  try {
    const output = execSync('launchctl list 2>/dev/null', { encoding: 'utf8' })
    for (const line of output.split('\n')) {
      if (!line.includes('shawnos')) continue
      const parts = line.trim().split(/\s+/)
      if (parts.length >= 3) {
        const pid = parts[0] === '-' ? null : parseInt(parts[0], 10)
        const exitCode = parseInt(parts[1], 10) || 0
        const label = parts[2]
        services.set(label, { pid, exitCode })
      }
    }
  } catch {
    // launchctl not available or error
  }
  return services
}

export function getJobStatus(
  label: string,
  plistPath: string,
  services?: Map<string, ServiceInfo>
): { status: JobStatus; exitCode: number; pid: number | null } {
  // Crontab entries (no plist)
  if (!plistPath) {
    return { status: 'crontab', exitCode: 0, pid: null }
  }

  const svc = services ?? getLoadedServices()
  const info = svc.get(label)

  if (!info) {
    // Not loaded
    const plistExists = existsSync(plistPath)
    return {
      status: plistExists ? 'stopped' : 'error',
      exitCode: -1,
      pid: null,
    }
  }

  if (info.pid && info.pid > 0) {
    return { status: 'running', exitCode: info.exitCode, pid: info.pid }
  }

  return {
    status: info.exitCode === 0 ? 'loaded' : 'error',
    exitCode: info.exitCode,
    pid: null,
  }
}

export function loadJob(plistPath: string): string {
  try {
    execSync(`launchctl load "${plistPath}"`, { encoding: 'utf8' })
    return 'ok'
  } catch (e: any) {
    return e.message || 'Failed to load'
  }
}

export function unloadJob(plistPath: string): string {
  try {
    execSync(`launchctl unload "${plistPath}"`, { encoding: 'utf8' })
    return 'ok'
  } catch (e: any) {
    return e.message || 'Failed to unload'
  }
}

export function runJobOnce(scriptPath: string): { pid: number } {
  const child = spawn('/bin/zsh', ['-c', scriptPath], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin',
      HOME: '/Users/shawnos.ai',
    },
  })
  child.unref()
  return { pid: child.pid ?? 0 }
}

export function getLastRunTime(logDir?: string, pattern?: string): string | null {
  if (!logDir || !existsSync(logDir)) return null

  try {
    if (pattern) {
      // Match structured log files like engage_*.json
      const prefix = pattern.replace('*', '')
      const files = readdirSync(logDir)
        .filter((f) => f.startsWith(prefix.replace('.json', '')) && f.endsWith('.json'))
        .sort()
        .reverse()
      if (files.length > 0) {
        const stat = statSync(`${logDir}/${files[0]}`)
        return stat.mtime.toISOString()
      }
    }
    return null
  } catch {
    return null
  }
}

export function getRecentLogs(logDir: string, pattern: string, count = 5): any[] {
  if (!existsSync(logDir)) return []

  try {
    const prefix = pattern.replace('*.json', '').replace('*', '')
    const files = readdirSync(logDir)
      .filter((f) => f.startsWith(prefix) && f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, count)

    return files.map((f) => {
      try {
        const content = readFileSync(`${logDir}/${f}`, 'utf8')
        return { file: f, ...JSON.parse(content) }
      } catch {
        return { file: f, error: 'parse failed' }
      }
    })
  } catch {
    return []
  }
}

export function tailLog(logPath: string, lines = 50): string {
  if (!logPath || !existsSync(logPath)) return ''

  try {
    const content = readFileSync(logPath, 'utf8')
    const allLines = content.split('\n')
    return allLines.slice(-lines).join('\n')
  } catch {
    return ''
  }
}
