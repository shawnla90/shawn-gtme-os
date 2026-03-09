import type { Metadata } from 'next'
import path from 'path'
import { getTranslations } from 'next-intl/server'
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Log')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'daily build log',
      'GTM engineering',
      'build in public',
      'AI workflow tracking',
      'content pipeline',
    ],
    alternates: { canonical: 'https://shawnos.ai/log' },
    openGraph: {
      title: `${t('metadata.title')} | shawnos.ai`,
      description: t('metadata.description'),
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
      title: `${t('metadata.title')} | shawnos.ai`,
      description: t('metadata.description'),
      images: [
        '/og?title=Daily+Build+Log&subtitle=Shipped+items%2C+word+counts%2C+content+pipeline',
      ],
    },
  }
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
