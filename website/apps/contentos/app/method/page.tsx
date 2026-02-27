import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { MethodContent } from './MethodContent'

const SITE_URL = 'https://thecontentos.ai'

export const metadata: Metadata = {
  title: 'Method - The 3-Tier Content Operating System',
  description:
    'The architecture behind Content OS: Voice DNA, Context Playbooks, and Content Ops. Your content strategy should be a system, not a calendar. A repo, not a spreadsheet. Infrastructure, not inspiration.',
  keywords: [
    'content operating system',
    'voice DNA',
    'content playbooks',
    'content ops',
    'AI content system',
    'content architecture',
    'voice system',
    'content infrastructure',
    'recursive content loop',
    'content automation',
  ],
  alternates: { canonical: `${SITE_URL}/method` },
  openGraph: {
    title: 'Method - The 3-Tier Content Operating System | theContentOS.ai',
    description:
      'Voice DNA, Context Playbooks, Content Ops. Your content strategy should be a system, not a calendar.',
    url: `${SITE_URL}/method`,
    images: [
      {
        url: '/og?title=The+Method&subtitle=3-Tier+Content+Operating+System',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Method - The 3-Tier Content Operating System | theContentOS.ai',
    description:
      'Voice DNA, Context Playbooks, Content Ops. Your content strategy should be a system, not a calendar.',
    images: ['/og?title=The+Method&subtitle=3-Tier+Content+Operating+System'],
  },
}

export default function MethodPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Method', url: `${SITE_URL}/method` }]}
      />
      <MethodContent />
    </>
  )
}
