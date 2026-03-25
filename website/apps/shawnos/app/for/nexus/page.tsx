import type { Metadata } from 'next'
import { NexusProposalContent } from './NexusProposalContent'

export const metadata: Metadata = {
  title: 'Built for Nexus Construction | ShawnOS.ai',
  description: 'Custom 30-day build proposal for Nexus Construction & Design. Website, intelligence engine, and growth strategy.',
  robots: { index: false, follow: false },
}

export default function NexusProposalPage() {
  return <NexusProposalContent />
}
