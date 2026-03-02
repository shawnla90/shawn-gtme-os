import type { Metadata } from 'next'
import { ClearCoveContent } from './ClearCoveContent'

export const metadata: Metadata = {
  title: 'Built for Clear Cove Partners | AI-Powered GTM Infrastructure',
  description: 'A custom proposal for AI-powered go-to-market infrastructure at Clear Cove Partners.',
  robots: { index: false, follow: false },
}

export default function ClearCovePage() {
  return <ClearCoveContent />
}
