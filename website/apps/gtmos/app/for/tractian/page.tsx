import type { Metadata } from 'next'
import { TractianContent } from './TractianContent'

export const metadata: Metadata = {
  title: 'Built for Tractian | AI Sales Development Infrastructure',
  description:
    'A custom proposal for scaling AI-powered sales development at Tractian. Signal-based outbound, enrichment automation, and SDR enablement — built to compound.',
  robots: { index: false, follow: false },
}

export default function TractianPage() {
  return <TractianContent />
}
