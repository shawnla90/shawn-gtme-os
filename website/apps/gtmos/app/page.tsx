import type { Metadata } from 'next'
import path from 'path'
import { getAllLogs } from '@shawnos/shared/lib'
import { HomeContent } from './HomeContent'

export const metadata: Metadata = {
  title: 'theGTMOS.ai | the GTM operating system',
  description:
    'Pipeline orchestration, outbound automation, and partner workflows. Running from one repo. The go-to-market operating system, built in public.',
  alternates: { canonical: 'https://thegtmos.ai' },
  openGraph: {
    title: 'theGTMOS.ai | the GTM operating system',
    description:
      'Pipeline orchestration, outbound automation, and partner workflows. Running from one repo.',
    url: 'https://thegtmos.ai',
  },
  twitter: {
    title: 'theGTMOS.ai | the GTM operating system',
    description:
      'Pipeline orchestration, outbound automation, and partner workflows. Running from one repo.',
  },
}

const LOG_DIR = path.join(process.cwd(), '../../../data/daily-log')

export default function HomePage() {
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  return <HomeContent latestLog={latestLog} />
}
