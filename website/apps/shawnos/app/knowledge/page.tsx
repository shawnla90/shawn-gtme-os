import type { Metadata } from 'next'
import { KnowledgeGuidePage } from '@shawnos/shared/pages/KnowledgeGuidePage'

export const metadata: Metadata = {
  title: 'Knowledge Guide | Engineering & AI Terms You Actually Need',
  description:
    'Git, Vercel, AI agents, cron jobs, and the technical terms you need to know in 2026. No gatekeeping, no overcomplicated BS.',
  keywords: [
    'git',
    'vercel',
    'ai agents',
    'deployment',
    'vibe coding',
    'gtm engineering',
    'cursor ide',
    'mcp servers',
    'monorepo',
    'developer tools',
  ],
  alternates: { canonical: 'https://shawnos.ai/knowledge' },
  openGraph: {
    title: 'Engineering & AI Knowledge Guide | shawnos.ai',
    description:
      'Technical terms explained for vibe coders and GTM engineers. No gatekeeping, no overcomplicated BS.',
    url: 'https://shawnos.ai/knowledge',
    images: [
      {
        url: '/og?title=Knowledge+Guide&subtitle=Engineering+and+AI+Terms',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Engineering & AI Knowledge Guide | shawnos.ai',
    description:
      'Technical terms explained for vibe coders and GTM engineers.',
    images: [
      '/og?title=Knowledge+Guide&subtitle=Engineering+and+AI+Terms',
    ],
  },
}

export default function Page() {
  return <KnowledgeGuidePage />
}
