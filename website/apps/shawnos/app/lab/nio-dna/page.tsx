import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { NioDnaLab } from './NioDnaLab'

export const metadata: Metadata = {
  title: 'Nio DNA Lab | ShawnOS.ai',
  description:
    'AI agent evolution in action. Watch Nio level up through real usage — XP, tiers, skills, and soul files. Built by the system it describes.',
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
    title: 'Nio DNA Lab | ShawnOS.ai',
    description:
      'AI agent evolution in action. Built by the system it describes.',
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
    title: 'Nio DNA Lab | ShawnOS.ai',
    description:
      'AI agent evolution in action. Built by the system it describes.',
    images: [
      '/og?title=Nio+DNA+Lab&subtitle=AI+agent+evolution+in+action.+Built+by+the+system+it+describes.',
    ],
  },
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
