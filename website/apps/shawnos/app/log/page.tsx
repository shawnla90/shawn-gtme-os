import type { Metadata } from 'next'
import path from 'path'
import {
  getAllLogs,
  getLogAggregates,
  getRPGProfile,
  getAvatarUrlsForProfile,
  resolveDataRoot,
} from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import LogIndexClient from './LogIndexClient'

const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export const metadata: Metadata = {
  title: 'Daily Build Log',
  description:
    'Daily build log from the GTM operating system. Shipped items, word counts, content pipeline, AI workflow tracking.',
  keywords: [
    'daily build log',
    'GTM engineering',
    'build in public',
    'AI workflow tracking',
    'content pipeline',
  ],
  alternates: { canonical: 'https://shawnos.ai/log' },
  openGraph: {
    title: 'Daily Build Log | shawnos.ai',
    description:
      'Daily build log from the GTM operating system. Shipped items, word counts, content pipeline, AI workflow tracking.',
    url: 'https://shawnos.ai/log',
    images: [
      {
        url: '/og?title=Daily+Build+Log&subtitle=Shipped+items%2C+word+counts%2C+content+pipeline',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Daily Build Log | shawnos.ai',
    description:
      'Daily build log from the GTM operating system. Shipped items, word counts, content pipeline, AI workflow tracking.',
    images: [
      '/og?title=Daily+Build+Log&subtitle=Shipped+items%2C+word+counts%2C+content+pipeline',
    ],
  },
}

export default function LogIndex() {
  const logs = getAllLogs(LOG_DIR)
  const aggregates = getLogAggregates(LOG_DIR)

  const profile = getRPGProfile(DATA_ROOT)
  const urls = profile && profile.level > 0 ? getAvatarUrlsForProfile(profile) : null

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Log', url: 'https://shawnos.ai/log' }]} />
      <LogIndexClient
        logs={logs}
        aggregates={aggregates}
        profile={profile}
        avatarUrls={urls}
      />
    </>
  )
}
