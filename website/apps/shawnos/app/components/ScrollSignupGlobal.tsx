'use client'

import { usePathname } from 'next/navigation'
import { ScrollSignup } from '@shawnos/shared/components'

export function ScrollSignupGlobal() {
  const pathname = usePathname()
  // Skip homepage (all locales)
  if (pathname === '/' || /^\/[a-z]{2}$/.test(pathname)) return null
  return <ScrollSignup />
}
