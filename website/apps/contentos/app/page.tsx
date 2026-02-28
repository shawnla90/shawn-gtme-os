import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs } from '@shawnos/shared/lib'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'theContentOS.ai | the content operating system',
  description:
    'One voice across every platform. AI-powered content that sounds like you, not AI slop. Voice engine, platform playbooks, and recursive content loops. From one repo.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'theContentOS.ai | the content operating system',
    description:
      'One voice across every platform. AI-powered content that sounds like you, not AI slop.',
    url: 'https://thecontentos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'theContentOS.ai | the content operating system',
    description:
      'One voice across every platform. AI-powered content that sounds like you, not AI slop.',
    images: ['/og'],
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return <HomeContent latestLog={latestLog} />
}
