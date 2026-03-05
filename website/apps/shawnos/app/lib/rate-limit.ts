interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

const CLEANUP_INTERVAL = 60_000
const WINDOW_MS = 60_000

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const cutoff = Date.now() - WINDOW_MS * 2
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter(t => t > cutoff)
      if (entry.timestamps.length === 0) store.delete(key)
    }
  }, CLEANUP_INTERVAL)
  if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    (cleanupTimer as NodeJS.Timeout).unref()
  }
}

export function checkRateLimit(key: string, maxRequests: number): { allowed: boolean; remaining: number } {
  ensureCleanup()
  const now = Date.now()
  const cutoff = now - WINDOW_MS

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  entry.timestamps = entry.timestamps.filter(t => t > cutoff)

  if (entry.timestamps.length >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.timestamps.push(now)
  return { allowed: true, remaining: maxRequests - entry.timestamps.length }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}
