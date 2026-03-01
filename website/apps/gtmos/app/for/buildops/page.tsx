import { Suspense } from 'react'
import type { Metadata } from 'next'
import { BuildOpsContent } from './BuildOpsContent'
import { ABMTracker } from '../ABMTracker'

export const metadata: Metadata = {
  title: 'Built for BuildOps | AI Sales Development Infrastructure',
  description:
    'A custom proposal for scaling AI-powered sales development at BuildOps. Signal-based outbound, enrichment automation, and SDR enablement  - built to compound.',
  robots: { index: false, follow: false },
}

export default function BuildOpsPage() {
  return (
    <>
      <Suspense>
        <ABMTracker slug="buildops" company="BuildOps" />
      </Suspense>
      <BuildOpsContent />
    </>
  )
}
