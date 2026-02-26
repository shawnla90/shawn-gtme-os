'use client'

import { PageTransition } from '@shawnos/shared/components'

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
