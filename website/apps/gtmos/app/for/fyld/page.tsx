import type { Metadata } from 'next'
import { FYLDContent } from './FYLDContent'

export const metadata: Metadata = {
  title: 'Built for FYLD | AI Sales Development Infrastructure',
  description:
    'A custom proposal for scaling AI-powered sales development at FYLD. Signal-based outbound, enrichment automation, and SDR enablement — built to compound.',
  robots: { index: false, follow: false },
}

export default function FYLDPage() {
  return <FYLDContent />
}
