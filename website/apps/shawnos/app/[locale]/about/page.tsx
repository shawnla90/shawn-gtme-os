import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { AboutContent } from './AboutContent'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'About' })

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'GTM engineer',
      'revenue operations engineer',
      'GTM systems architect',
      'go-to-market automation',
      'sales operations engineer',
      'AI-native development',
      'monorepo builder',
      'Clay HubSpot automation',
      'outbound pipeline engineering',
      'Cursor IDE developer',
    ],
    alternates: { canonical: 'https://shawnos.ai/about' },
    openGraph: {
      title: t('metadata.ogTitle'),
      description: t('metadata.ogDescription'),
      url: 'https://shawnos.ai/about',
      images: [{ url: '/og?title=About&subtitle=GTM+Engineer.+Builder.+Shipped+from+a+monorepo.', width: 1200, height: 630 }],
    },
    twitter: {
      title: t('metadata.ogTitle'),
      description: t('metadata.ogDescription'),
      images: ['/og?title=About&subtitle=GTM+Engineer.+Builder.+Shipped+from+a+monorepo.'],
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'About', url: 'https://shawnos.ai/about' }]} />
      <AboutContent />
    </>
  )
}
