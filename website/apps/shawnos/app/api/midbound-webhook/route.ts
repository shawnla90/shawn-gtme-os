import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_zlJOdh1FPyUXLHSWVQITPRFZxGIrGdHonI5mlUJupJC'
const POSTHOG_HOST = 'https://us.i.posthog.com'
const MIDBOUND_SIGNING_SECRET = process.env.MIDBOUND_SIGNING_SECRET

function verifySignature(payload: string, signature: string | null): boolean {
  if (!MIDBOUND_SIGNING_SECRET || !signature) return !MIDBOUND_SIGNING_SECRET
  const expected = crypto
    .createHmac('sha256', MIDBOUND_SIGNING_SECRET)
    .update(payload)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Verify webhook signature if secret is configured
  const signature = req.headers.get('x-midbound-signature') ?? req.headers.get('x-signature')
  if (MIDBOUND_SIGNING_SECRET && !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Extract person data from Midbound payload
  // Midbound sends different event types - we care about identity.enriched and identity.qualified
  const data = (body.data ?? body) as Record<string, unknown>
  const person = (data.person ?? data.identity ?? data) as Record<string, unknown>
  const company = (data.company ?? person.company ?? {}) as Record<string, unknown>
  const session = (data.session ?? {}) as Record<string, unknown>

  const email = person.email as string | undefined
  const firstName = person.first_name as string ?? person.firstName as string ?? ''
  const lastName = person.last_name as string ?? person.lastName as string ?? ''
  const name = (person.name as string) ?? `${firstName} ${lastName}`.trim()
  const title = person.title as string ?? person.job_title as string ?? ''
  const linkedin = person.linkedin_url as string ?? person.linkedin as string ?? ''

  const companyName = company.name as string ?? ''
  const companyDomain = company.domain as string ?? ''
  const companyIndustry = company.industry as string ?? ''
  const companySize = company.employee_count as string ?? company.size as string ?? ''

  if (!email) {
    return NextResponse.json({ ok: true, skipped: 'no email' })
  }

  // Identify in PostHog using the email as distinct_id
  const properties: Record<string, unknown> = {
    $set: {
      email,
      name: name || undefined,
      title: title || undefined,
      linkedin_url: linkedin || undefined,
      company_name: companyName || undefined,
      company_domain: companyDomain || undefined,
      company_industry: companyIndustry || undefined,
      company_size: companySize || undefined,
      midbound_source: true,
      midbound_event: body.event ?? 'unknown',
      midbound_identified_at: new Date().toISOString(),
    },
  }

  // Include session data if available
  if (session.landing_page || session.referrer) {
    (properties.$set as Record<string, unknown>).first_seen_url = session.landing_page
    ;(properties.$set as Record<string, unknown>).first_seen_referrer = session.referrer
  }

  try {
    const res = await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        distinct_id: email,
        event: '$identify',
        properties,
      }),
    })

    if (!res.ok) {
      console.error('[midbound-webhook] PostHog error:', res.status, await res.text())
      return NextResponse.json({ error: 'PostHog failed' }, { status: 502 })
    }

    // Also capture a custom event for tracking
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        distinct_id: email,
        event: 'midbound_visitor_identified',
        properties: {
          name,
          email,
          title,
          company_name: companyName,
          company_domain: companyDomain,
          company_industry: companyIndustry,
          company_size: companySize,
          landing_page: session.landing_page ?? '',
          referrer: session.referrer ?? '',
          midbound_event_type: body.event ?? 'unknown',
        },
      }),
    })
  } catch (err) {
    console.error('[midbound-webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, identified: email })
}
