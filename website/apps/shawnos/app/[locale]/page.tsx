import type { Metadata } from 'next'
import path from 'path'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getAllPosts, getTimelineItems, resolveDataRoot, getLearningDisciplines } from '@shawnos/shared/lib'
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

const DATA_ROOT = resolveDataRoot()
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')

export const revalidate = 3600

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const posts = getAllPosts(CONTENT_DIR).filter((p) => p.category !== 'claude-daily')
  const featured = posts.filter((p) => p.featured)
  // prefer hand-picked featured posts; fall back to latest if fewer than 3 are flagged
  const homeFeatured = (featured.length >= 3 ? featured : posts).slice(0, 3)
  const timeline = getTimelineItems({
    contentDir: CONTENT_DIR,
    blogHrefBase: locale === 'en' ? '/blog' : `/${locale}/blog`,
    limit: 12,
    excludeCategories: ['claude-daily'],
  })

  const learning = getLearningDisciplines(DATA_ROOT).disciplines

  let karma = '2,181'
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
      <HomeContent posts={homeFeatured} timeline={timeline} karma={karma} learning={learning} />
      <LiveUpdatesWidget announcements={announcements} />
    </>
  )
}
