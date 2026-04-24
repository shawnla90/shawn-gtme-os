import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs } from '@shawnos/shared/lib'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'ContentOS — The Best AI Assistant for Solopreneurs',
  description:
    'ContentOS is the AI-powered content operating system built for solopreneurs. Write, publish, and distribute faster with your personal AI assistant.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'ContentOS — The Best AI Assistant for Solopreneurs',
    description:
      'ContentOS is the AI-powered content operating system built for solopreneurs. Write, publish, and distribute faster with your personal AI assistant.',
    url: 'https://thecontentos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'ContentOS — The Best AI Assistant for Solopreneurs',
    description:
      'ContentOS is the AI-powered content operating system built for solopreneurs. Write, publish, and distribute faster with your personal AI assistant.',
    images: ['/og'],
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return <HomeContent latestLog={latestLog} />
}
