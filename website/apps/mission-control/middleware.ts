import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRIVATE_PREFIXES = ['/logs', '/office', '/databases', '/analytics', '/crm', '/crons']
const PRIVATE_API_PREFIXES = ['/api/db', '/api/crm', '/api/office', '/api/ops', '/api/crons', '/api/kill-switches']
const PUBLIC_PATHS = ['/sign-in', '/api/auth']
const AUTH_COOKIE = 'mc-auth'

/**
 * Verify HMAC-signed auth token using Web Crypto API (Edge Runtime compatible).
 * Cookie format: `uuid-token.hex-signature`
 */
async function verifyAuthToken(cookieValue: string, secret: string): Promise<boolean> {
  const dotIndex = cookieValue.indexOf('.')
  if (dotIndex === -1) return false

  const token = cookieValue.slice(0, dotIndex)
  const signature = cookieValue.slice(dotIndex + 1)
  if (!token || !signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(token))
  const expectedHex = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // Constant-time comparison
  if (expectedHex.length !== signature.length) return false
  let result = 0
  for (let i = 0; i < expectedHex.length; i++) {
    result |= expectedHex.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  return result === 0
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Password gate — only active when MC_PASSWORD is set (deployed mode)
  const mcPassword = process.env.MC_PASSWORD
  if (mcPassword) {
    const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
    if (!isPublicPath) {
      const authCookie = request.cookies.get(AUTH_COOKIE)?.value

      let isValid = false
      if (authCookie) {
        isValid = await verifyAuthToken(authCookie, mcPassword)
      }

      if (!isValid) {
        // Redirect to sign-in
        const signInUrl = new URL('/sign-in', request.url)
        signInUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(signInUrl)
      }
    }
  }

  // Public mode gating (existing logic)
  if (process.env.NEXT_PUBLIC_MODE === 'public') {
    const isPrivate = PRIVATE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
    )
    if (isPrivate) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const isPrivateApi = PRIVATE_API_PREFIXES.some(
      (prefix) => pathname.startsWith(prefix)
    )
    if (isPrivateApi) {
      return NextResponse.json({ error: 'Not available in public mode' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
