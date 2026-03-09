import type { Metadata } from 'next'
import path from 'path'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPosts, getAllLogs, getRPGProfile, getAvatarUrlsForProfile, resolveDataRoot } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { HomeContent } from '../HomeContent'
import { LiveUpdatesWidget } from '../components/LiveUpdatesWidget'
import { announcements } from '../data/announcements'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: { canonical: 'https://shawnos.ai' },
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: 'https://shawnos.ai',
      images: [{ url: '/og', width: 1200, height: 630 }],
    },
    twitter: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      images: ['/og'],
    },
  }
}

const DATA_ROOT = resolveDataRoot()
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const posts = getAllPosts(CONTENT_DIR)
  const latestPosts = posts.slice(0, 3)
  const logs = getAllLogs(LOG_DIR)
  const latestLog = logs.length > 0 ? logs[0] : null

  const profile = getRPGProfile(DATA_ROOT)
  const urls =
    profile && profile.level > 0 ? getAvatarUrlsForProfile(profile) : null

  return (
    <>
      <BreadcrumbSchema items={[]} />
      <HomeContent
        posts={latestPosts}
        latestLog={latestLog}
        profile={profile}
        avatarUrls={urls}
      />
      <LiveUpdatesWidget announcements={announcements} />
    </>
  )
}
