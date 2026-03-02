import type { Metadata } from 'next'
import { SagemontContent } from './SagemontContent'

export const metadata: Metadata = {
  title: 'Built for Sagemont Advisors | AI-Powered GTM Infrastructure',
  description: 'A custom proposal for AI-powered go-to-market infrastructure at Sagemont Advisors.',
  robots: { index: false, follow: false },
}

export default function SagemontPage() {
  return <SagemontContent />
}
