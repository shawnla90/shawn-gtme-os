import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { NioDnaLab } from './NioDnaLab'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Lab')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'AI agent evolution',
      'Claude Code Max',
      'AI DNA system',
      'agent XP progression',
      'build in public AI',
      'AI soul files',
      'MCP servers',
      'Claude CLAUDE.md',
      'AI ops agent',
      'gamified AI agent',
    ],
    alternates: { canonical: 'https://shawnos.ai/lab/nio-dna' },
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: 'https://shawnos.ai/lab/nio-dna',
      images: [
        {
          url: '/og?title=Nio+DNA+Lab&subtitle=AI+agent+evolution+in+action.+Built+by+the+system+it+describes.',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      images: [
        '/og?title=Nio+DNA+Lab&subtitle=AI+agent+evolution+in+action.+Built+by+the+system+it+describes.',
      ],
    },
  }
}

export default function NioDnaLabPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Nio DNA Lab', url: 'https://shawnos.ai/lab/nio-dna' }]}
      />
      <NioDnaLab />
    </>
  )
}
