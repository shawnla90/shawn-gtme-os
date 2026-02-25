/**
 * Public/Private mode gating for Mission Control.
 *
 * Set NEXT_PUBLIC_MODE=public in env to hide private routes and data.
 * Default (unset or "private") shows everything.
 */

export const isPublicMode = process.env.NEXT_PUBLIC_MODE === 'public'

/** Routes that are gated in public mode */
export const PRIVATE_ROUTES = [
  '/logs',
  '/office',
  '/databases',
  '/analytics',
  '/crm',
]

/** Check if a pathname is private */
export function isPrivateRoute(pathname: string): boolean {
  return PRIVATE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  )
}
