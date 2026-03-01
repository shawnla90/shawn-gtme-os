import { Suspense } from 'react'
import type { Metadata } from 'next'
import { MaintainXContent } from './MaintainXContent'
import { ABMTracker } from '../ABMTracker'

export const metadata: Metadata = {
  title: 'Built for MaintainX | AI Sales Development Infrastructure',
  description:
    'A custom proposal for scaling AI-powered sales development at MaintainX. Signal-based outbound, enrichment automation, and SDR enablement  - built to compound.',
  robots: { index: false, follow: false },
}

export default function MaintainXPage() {
  return (
    <>
      <Suspense>
        <ABMTracker slug="maintainx" company="MaintainX" />
      </Suspense>
      <MaintainXContent />
    </>
  )
}
