import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRIVATE_PREFIXES = ['/logs', '/office', '/databases', '/analytics', '/crm']

export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_MODE !== 'public') {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Gate private pages
  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
  if (isPrivate) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Gate private API routes
  const privateApiPrefixes = ['/api/db', '/api/crm', '/api/office', '/api/ops']
  const isPrivateApi = privateApiPrefixes.some(
    (prefix) => pathname.startsWith(prefix)
  )
  if (isPrivateApi) {
    return NextResponse.json({ error: 'Not available in public mode' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/logs/:path*', '/office/:path*', '/databases/:path*',
    '/analytics/:path*', '/crm/:path*',
    '/api/db/:path*', '/api/crm/:path*', '/api/office/:path*', '/api/ops/:path*',
  ],
}
