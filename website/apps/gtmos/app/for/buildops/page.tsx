import type { Metadata } from 'next'
import { BuildOpsContent } from './BuildOpsContent'

export const metadata: Metadata = {
  title: 'Built for BuildOps | AI Sales Development Infrastructure',
  description:
    'A custom proposal for scaling AI-powered sales development at BuildOps. Signal-based outbound, enrichment automation, and SDR enablement  - built to compound.',
  robots: { index: false, follow: false },
}

export default function BuildOpsPage() {
  return <BuildOpsContent />
}
