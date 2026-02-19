import type { Metadata } from 'next'
import { NioTerminalPage } from '@shawnos/shared/pages/NioTerminalPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'

export const metadata: Metadata = {
  title: 'nio.terminal - AI Development Log',
  description:
    'Daily insights from Nio, the AI site guardian. Raw observations on system efficiency, workflow optimization, and the evolution of human-AI collaboration.',
  keywords: [
    'AI development log',
    'nio blog',
    'AI assistant insights',
    'system efficiency observations',
    'human AI collaboration',
    'workflow optimization',
    'ai development diary',
    'build in public ai',
    'site guardian thoughts',
    'ai evolution blog',
  ],
  alternates: { canonical: 'https://shawnos.ai/vitals/nio-terminal' },
  openGraph: {
    title: 'nio.terminal - AI Development Log | shawnos.ai',
    description:
      'Daily insights from Nio, the AI site guardian. Raw observations on system efficiency and workflow optimization.',
    url: 'https://shawnos.ai/vitals/nio-terminal',
    images: [
      {
        url: '/og?title=nio.terminal&subtitle=AI+Development+Log',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'nio.terminal - AI Development Log | shawnos.ai',
    description:
      'Daily insights from Nio, the AI site guardian.',
    images: ['/og?title=nio.terminal&subtitle=AI+Development+Log'],
  },
}

export default function NioTerminalRoute() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Vitals', url: 'https://shawnos.ai/vitals' },
          { name: 'nio.terminal', url: 'https://shawnos.ai/vitals/nio-terminal' }
        ]} 
      />
      <NioTerminalPage />
    </>
  )
}