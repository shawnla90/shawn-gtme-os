import type { Metadata } from 'next'
import { WhyIndependentContent } from './WhyIndependentContent'

export const metadata: Metadata = {
  title: 'Why Hire an Independent Go-to-Market Engineer Consultant',
  description:
    'Your GTM stack deserves a second opinion. Independent evaluation of your tools, workflows, and vendor relationships - no agency allegiance, no vendor lock-in.',
  openGraph: {
    title: 'Why Independent | theGTMOS.ai',
    description:
      'Not an agency. Not a vendor. An independent go-to-market engineer consultant who evaluates your tools, audits your workflows, and builds infrastructure you own.',
    type: 'article',
  },
}

export default function WhyIndependentPage() {
  return <WhyIndependentContent />
}
