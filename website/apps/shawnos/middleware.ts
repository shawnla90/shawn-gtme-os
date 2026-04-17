import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  // Force revalidation on HTML responses
  const accept = request.headers.get('accept') || ''
  if (accept.includes('text/html') || request.headers.get('sec-fetch-dest') === 'document') {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  }

  // Security headers. Every third-party analytics host must be allowlisted in
  // the correct directive or the browser silently blocks it and the vendor's
  // verifier reports "script not detected" even though the tag is in HTML.
  //   - Midbound B2B visitor reveal: full chain.
  //     Stage 1 loader at *.midbound.click, stage 2 pixel at *.midbound.net,
  //     stage 3 identity at *.mdb.tools, stage 4 external fingerprint at
  //     a.usbrowserspeed.com, stage 5 event ingestion at api.sitelytics.tech,
  //     stage 6 Sovrn/Lijit identity graph enrichment at *.lijit.com.
  //   - PostHog: us.i.posthog.com (capture/decide) + us-assets.i.posthog.com (SDK assets/array config)
  //   - Cloudflare insights beacon: static.cloudflareinsights.com + cloudflareinsights.com
  //   - Substack featured post embed: *.substack.com
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.midbound.click https://*.midbound.net https://*.mdb.tools https://a.usbrowserspeed.com https://*.lijit.com https://us-assets.i.posthog.com https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.midbound.click https://*.midbound.net https://*.mdb.tools https://a.usbrowserspeed.com https://*.lijit.com https://us-assets.i.posthog.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://*.midbound.click https://*.midbound.net https://*.mdb.tools https://a.usbrowserspeed.com https://*.lijit.com https://api.sitelytics.tech https://cloudflareinsights.com",
    "frame-src 'self' https://*.substack.com",
    "frame-ancestors 'none'",
  ].join('; ')
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|avatars|ingest|api|og|feed|feed\\.xml|sitemap|robots\\.txt|for|.*\\..*).*)',
  ],
}
