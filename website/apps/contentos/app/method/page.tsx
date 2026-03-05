import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { MethodContent } from './MethodContent'

const SITE_URL = 'https://thecontentos.ai'

export const metadata: Metadata = {
  title: 'Method - AI Content System & Python AI Workflow | 3-Tier Content OS',
  description:
    'The architecture behind Content OS: Voice DNA, Context Playbooks, and Content Ops. Your content strategy should be a system, not a calendar. A repo, not a spreadsheet. Infrastructure, not inspiration.',
  keywords: [
    'content operating system',
    'voice DNA',
    'content playbooks',
    'content ops',
    'AI content system',
    'Python AI workflow',
    'personal AI assistant setup',
    'content architecture',
    'voice system',
    'content infrastructure',
    'recursive content loop',
    'content automation',
  ],
  alternates: { canonical: `${SITE_URL}/method` },
  openGraph: {
    title: 'Method - AI Content System & Python AI Workflow | theContentOS.ai',
    description:
      'Voice DNA, Context Playbooks, Content Ops. A proven AI content system for creators and developers - including Python AI workflows and personal AI assistant setups. Your content strategy should be a system, not a calendar.',
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
    title: 'Method - AI Content System & Python AI Workflow | theContentOS.ai',
    description:
      'Voice DNA, Context Playbooks, Content Ops. A proven AI content system for creators and developers - including Python AI workflows and personal AI assistant setups. Your content strategy should be a system, not a calendar.',
    images: ['/og?title=The+Method&subtitle=3-Tier+Content+Operating+System'],
  },
}

export default function MethodPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Method', url: `${SITE_URL}/method` }]}
      />
      <p className="sr-only">
        ContentOS works for any knowledge-based creator — including developers
        building Python-based AI assistant workflows and personal AI assistant
        setups. The same 3-tier system structures your voice, your context, and
        your content ops whether you&apos;re a solo creator or an AI content
        system running at scale.
      </p>
      <MethodContent />
    </>
  )
}
