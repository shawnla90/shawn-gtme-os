// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '../../../lib/auth'
import { checkRateLimit, getClientIP } from '../../../lib/rate-limit'
import { logAuthAttempt } from '../../../lib/audit'

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)

  // Rate limit: 5 attempts per minute
  const { allowed } = checkRateLimit(`auth:${ip}`, 5)
  if (!allowed) {
    logAuthAttempt(ip, false)
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Try again later.' },
      { status: 429 }
    )
  }

  const token = process.env.NIO_CHAT_TOKEN
  if (!token) {
    return NextResponse.json({ ok: true })
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.password === token) {
    logAuthAttempt(ip, true)
    const sessionToken = createSessionToken()
    return NextResponse.json({ ok: true, token: sessionToken })
  }

  logAuthAttempt(ip, false)
  return NextResponse.json({ ok: false, error: 'Wrong password' }, { status: 401 })
}
