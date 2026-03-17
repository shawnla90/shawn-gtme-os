/**
 * Server-side newsletter subscribe handler.
 * 1. Validates email
 * 2. Captures to PostHog (persistent, always works on Vercel)
 * 3. Forwards to Substack API
 *
 * Each site's /api/subscribe/route.ts just re-exports this.
 */

import { NextRequest, NextResponse } from 'next/server'
import { notifySignup } from './subscribe-notify'

const SUBSTACK_URL = 'https://shawntenam.substack.com/api/v1/free?nojs=true'

const POSTHOG_KEY = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY || ''
const POSTHOG_HOST = 'https://us.i.posthog.com'

async function captureToPostHog(email: string, site: string, forwarded: boolean, substackStatus: number): Promise<void> {
  if (!POSTHOG_KEY) return
  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event: 'newsletter_signup_server',
        distinct_id: email,
        properties: {
          email,
          site,
          source: 'scroll-signup',
          forwarded_to_substack: forwarded,
          substack_status: substackStatus,
          $current_url: `https://${site === 'gtmos' ? 'thegtmos.ai' : site === 'contentos' ? 'thecontentos.ai' : 'shawnos.ai'}`,
        },
      }),
    })
  } catch {
    // Non-fatal
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
    const forwarded = substackStatus >= 200 && substackStatus < 400

    // Capture to PostHog (persistent — works on Vercel)
    // Notify via Telegram + Google Sheet
    await Promise.allSettled([
      captureToPostHog(email, site, forwarded, substackStatus),
      notifySignup(email, site),
    ])

    return NextResponse.json({
      message: 'Subscribed',
      captured: true,
      forwarded,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
