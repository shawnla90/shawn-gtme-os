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

  // Security headers
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://us.i.posthog.com; frame-ancestors 'none'"
  )
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
