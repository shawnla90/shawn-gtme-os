import { Suspense } from 'react'
import type { Metadata } from 'next'
import { TractianContent } from './TractianContent'
import { ABMTracker } from '../ABMTracker'

export const metadata: Metadata = {
  title: 'Built for Tractian | AI Sales Development Infrastructure',
  description:
    'A custom proposal for scaling AI-powered sales development at Tractian. Signal-based outbound, enrichment automation, and SDR enablement  - built to compound.',
  robots: { index: false, follow: false },
}

export default function TractianPage() {
  return (
    <>
      <Suspense>
        <ABMTracker slug="tractian" company="Tractian" />
      </Suspense>
      <TractianContent />
    </>
  )
}
