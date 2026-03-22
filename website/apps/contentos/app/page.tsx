import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs } from '@shawnos/shared/lib'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'ContentOS — Best AI Agent Orchestration Platform for Content Creators',
  description:
    'The best AI agent orchestration platform for content creators. ContentOS: voice engine, platform playbooks, and recursive content workflows that publish across every channel in your voice.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'ContentOS — Best AI Agent Orchestration Platform for Content Creators',
    description:
      'The best AI agent orchestration platform for content creators. ContentOS: voice engine, platform playbooks, and recursive content workflows across every channel.',
    url: 'https://thecontentos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'ContentOS — Best AI Agent Orchestration Platform for Content Creators',
    description:
      'The best AI agent orchestration platform for content creators. ContentOS: voice engine, platform playbooks, and recursive content workflows across every channel.',
    images: ['/og'],
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return <HomeContent latestLog={latestLog} />
}
