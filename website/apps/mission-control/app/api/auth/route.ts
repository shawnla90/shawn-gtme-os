import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Rate limiter — 5 failed attempts per 15-minute window
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now > record.resetAt) return false
  return record.count >= MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  } else {
    record.count++
  }
}

export async function POST(request: NextRequest) {
  const mcPassword = process.env.MC_PASSWORD
  if (!mcPassword) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
  }

  // CSRF protection — verify Origin matches Host
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  if (origin && host) {
    try {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    } catch {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  // Rate limiting
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429 }
    )
  }

  const { password } = await request.json()

  if (password !== mcPassword) {
    recordFailedAttempt(ip)
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // Generate HMAC-signed token (never store raw password in cookie)
  const token = crypto.randomUUID()
  const signature = crypto.createHmac('sha256', mcPassword).update(token).digest('hex')
  const cookieValue = `${token}.${signature}`

  const response = NextResponse.json({ ok: true })

  response.cookies.set('mc-auth', cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('mc-auth')
  return response
}
