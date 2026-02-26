'use client'

import { PageTransition } from './components/motion'

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
