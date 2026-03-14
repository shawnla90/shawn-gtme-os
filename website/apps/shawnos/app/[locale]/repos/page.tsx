import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { RepoHubContent } from './RepoHubContent'
import { repos } from '@shawnos/shared/data/repos'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Repos' })
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: {
      canonical: 'https://shawnos.ai/repos',
      languages: hreflang('/repos'),
    },
    openGraph: {
      title: 'RepoHub | shawnos.ai',
      description: t('metadata.description'),
      url: 'https://shawnos.ai/repos',
      images: [{ url: '/og?title=RepoHub&subtitle=open+source+repos+and+community+builds', width: 1200, height: 630 }],
    },
    twitter: {
      title: 'RepoHub | shawnos.ai',
      description: t('metadata.description'),
      images: ['/og?title=RepoHub&subtitle=open+source+repos+and+community+builds'],
    },
  }
}

export default async function ReposPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'RepoHub',
    url: 'https://shawnos.ai/repos',
    description: 'Open source repos, community builds, and recommended tools.',
    numberOfItems: repos.length,
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'RepoHub', url: 'https://shawnos.ai/repos' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <RepoHubContent />
    </>
  )
}
