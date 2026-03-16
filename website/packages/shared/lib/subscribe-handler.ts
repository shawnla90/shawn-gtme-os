/**
 * Server-side newsletter subscribe handler.
 * 1. Validates email
 * 2. Saves to local JSON log (never lose a signup)
 * 3. Forwards to Substack API
 *
 * Each site's /api/subscribe/route.ts just re-exports this.
 */

import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const SUBSTACK_URL = 'https://shawntenam.substack.com/api/v1/free?nojs=true'

// Persistent log file — gitignored via data/ pattern
const LOG_DIR = path.join(process.cwd(), '..', '..', '..', 'data')
const LOG_FILE = path.join(LOG_DIR, 'newsletter-signups.json')

interface SignupEntry {
  email: string
  timestamp: string
  site: string
  source: string
  forwarded: boolean
  substack_status?: number
}

async function appendSignup(entry: SignupEntry): Promise<void> {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true })
    let entries: SignupEntry[] = []
    try {
      const raw = await fs.readFile(LOG_FILE, 'utf-8')
      entries = JSON.parse(raw)
    } catch {
      // File doesn't exist yet
    }
    entries.push(entry)
    await fs.writeFile(LOG_FILE, JSON.stringify(entries, null, 2))
  } catch {
    // Non-fatal — we still proceed with the signup
    console.error('[subscribe] Failed to write signup log')
  }
}

async function forwardToSubstack(email: string): Promise<number> {
  try {
    const params = new URLSearchParams({
      email,
      first_url: 'https://shawntenam.substack.com/',
      first_referrer: '',
      current_url: 'https://shawntenam.substack.com/',
      current_referrer: '',
    })
    const res = await fetch(SUBSTACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://shawntenam.substack.com',
        'Referer': 'https://shawntenam.substack.com/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      body: params.toString(),
    })
    return res.status
  } catch {
    return 0
  }
}

export async function handleSubscribe(request: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Detect which site this came from
    const host = request.headers.get('host') || ''
    const site = host.includes('gtmos')
      ? 'gtmos'
      : host.includes('contentos')
        ? 'contentos'
        : 'shawnos'

    // Forward to Substack
    const substackStatus = await forwardToSubstack(email)

    // Log locally (always, regardless of Substack result)
    await appendSignup({
      email,
      timestamp: new Date().toISOString(),
      site,
      source: 'scroll-signup',
      forwarded: substackStatus >= 200 && substackStatus < 400,
      substack_status: substackStatus,
    })

    // Even if Substack fails, we captured the email
    return NextResponse.json({
      message: 'Subscribed',
      captured: true,
      forwarded: substackStatus >= 200 && substackStatus < 400,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
