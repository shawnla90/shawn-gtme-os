import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs } from '@shawnos/shared/lib'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'ContentOS – AI Agent Automation Tools & Content Operating System',
  description:
    'ContentOS gives creators AI agent automation tools for fast AI agent setup and end-to-end content workflows that publish in your voice across every channel.',
  alternates: { canonical: 'https://thecontentos.ai' },
  openGraph: {
    title: 'ContentOS – AI Agent Automation Tools & Content Operating System',
    description:
      'ContentOS gives creators AI agent automation tools for fast AI agent setup and end-to-end content workflows that publish in your voice across every channel.',
    url: 'https://thecontentos.ai',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'ContentOS – AI Agent Automation Tools & Content Operating System',
    description:
      'ContentOS gives creators AI agent automation tools for fast AI agent setup and end-to-end content workflows that publish in your voice across every channel.',
    images: ['/og'],
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return <HomeContent latestLog={latestLog} />
}
