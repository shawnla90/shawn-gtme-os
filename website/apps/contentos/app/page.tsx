import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs } from '@shawnos/shared/lib'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'How to Create AI Assistant in Python & Ship Content | theContentOS.ai',
  description:
    'How to create an AI assistant in Python that publishes like you, not generic slop. ContentOS: voice engine, platform playbooks, and recursive content workflows across every channel. From one repo.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'How to Create AI Assistant in Python & Ship Content | theContentOS.ai',
    description:
      'How to create an AI assistant in Python that publishes like you, not generic slop. Voice engine, platform playbooks, and recursive content workflows.',
    url: 'https://thecontentos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'How to Create AI Assistant in Python & Ship Content | theContentOS.ai',
    description:
      'How to create an AI assistant in Python that publishes like you, not generic slop. Voice engine, platform playbooks, and recursive content workflows.',
    images: ['/og'],
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return <HomeContent latestLog={latestLog} />
}
