import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRIVATE_PREFIXES = ['/logs', '/office', '/databases', '/analytics', '/crm']
const PRIVATE_API_PREFIXES = ['/api/db', '/api/crm', '/api/office', '/api/ops']
const PUBLIC_PATHS = ['/sign-in', '/api/auth']
const AUTH_COOKIE = 'mc-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Password gate — only active when MC_PASSWORD is set (deployed mode)
  const mcPassword = process.env.MC_PASSWORD
  if (mcPassword) {
    const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
    if (!isPublicPath) {
      const authCookie = request.cookies.get(AUTH_COOKIE)?.value
      if (authCookie !== mcPassword) {
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
