import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs } from '@shawnos/shared/lib'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'How to Build an AI Assistant | theContentOS.ai',
  description:
    'Learn how to build an AI assistant that sounds like you, not generic slop. ContentOS: voice engine, platform playbooks, and recursive content loops across every platform. From one repo.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'How to Build an AI Assistant | theContentOS.ai',
    description:
      'Learn how to build an AI assistant that sounds like you, not generic slop. Voice engine, platform playbooks, and recursive content loops.',
    url: 'https://thecontentos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'How to Build an AI Assistant | theContentOS.ai',
    description:
      'Learn how to build an AI assistant that sounds like you, not generic slop. Voice engine, platform playbooks, and recursive content loops.',
    images: ['/og'],
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return <HomeContent latestLog={latestLog} />
}
