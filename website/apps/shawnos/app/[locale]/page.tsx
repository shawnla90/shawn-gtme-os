import type { Metadata } from 'next'
import path from 'path'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPosts, getTimelineItems, resolveDataRoot } from '@shawnos/shared/lib'
import { fetchUserProfile } from '@shawnos/shared/lib/reddit'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../i18n/hreflang'
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
    alternates: { canonical: 'https://shawnos.ai', languages: hreflang('/') },
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

const _DATA_ROOT = resolveDataRoot()
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')

export const revalidate = 3600

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const posts = getAllPosts(CONTENT_DIR).filter((p) => p.category !== 'claude-daily')
  const latestPosts = posts.slice(0, 3)
  const timeline = getTimelineItems({
    contentDir: CONTENT_DIR,
    blogHrefBase: locale === 'en' ? '/blog' : `/${locale}/blog`,
    limit: 8,
    excludeCategories: ['claude-daily'],
  })

  let karma = '1,089'
  try {
    const profile = await fetchUserProfile('Shawntenam')
    if (profile?.totalKarma) {
      karma = new Intl.NumberFormat('en-US').format(profile.totalKarma)
    }
  } catch {
    // fall back to default — cached/static value
  }

  return (
    <>
      <BreadcrumbSchema items={[]} />
      <HomeContent posts={latestPosts} timeline={timeline} karma={karma} />
      <LiveUpdatesWidget announcements={announcements} />
    </>
  )
}
