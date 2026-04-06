/**
 * Server-side newsletter subscribe handler.
 * 1. Validates email
 * 2. Captures to PostHog (persistent)
 * 3. Notifies via Telegram + Google Sheets
 *
 * Substack forwarding is handled client-side via iframe in ScrollSignup.tsx.
 * Server-side Substack API calls get Cloudflare 403'd.
 *
 * Each site's /api/subscribe/route.ts just re-exports this.
 */

import { NextRequest, NextResponse } from 'next/server'
import { notifySignup } from './subscribe-notify'

const POSTHOG_KEY = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_zlJOdh1FPyUXLHSWVQITPRFZxGIrGdHonI5mlUJupJC'
const POSTHOG_HOST = 'https://us.i.posthog.com'

async function captureToPostHog(email: string, site: string): Promise<void> {
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
          substack_method: 'client-iframe',
          $current_url: `https://${site === 'gtmos' ? 'thegtmos.ai' : site === 'contentos' ? 'thecontentos.ai' : 'shawnos.ai'}`,
        },
      }),
    })
  } catch {
    // Non-fatal
  }
}

export async function handleSubscribe(request: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const host = request.headers.get('host') || ''
    const site = host.includes('gtmos')
      ? 'gtmos'
      : host.includes('contentos')
        ? 'contentos'
        : 'shawnos'

    await Promise.allSettled([
      captureToPostHog(email, site),
      notifySignup(email, site),
    ])

    return NextResponse.json({
      message: 'Subscribed',
      captured: true,
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
