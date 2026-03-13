import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { hreflang } from '../../../i18n/hreflang'
import { getWebsiteStats, resolveDataRoot } from '@shawnos/shared/lib'
import { VitalsPage } from '@shawnos/shared/pages/VitalsPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PageHero, ScrollRevealSection } from './VitalsReveal'

const DATA_ROOT = resolveDataRoot()

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Vitals')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'developer portfolio stats',
      'code metrics dashboard',
      'website ecosystem scanner',
      'monorepo statistics',
      'technical portfolio vitals',
      'live code depth analysis',
      'build in public metrics',
      'developer output dashboard',
      'Next.js site statistics',
      'open source project stats',
    ],
    alternates: { canonical: 'https://shawnos.ai/vitals', languages: hreflang('/vitals') },
    openGraph: {
      title: 'System Vitals | shawnos.ai',
      description: t('metadata.description'),
      url: 'https://shawnos.ai/vitals',
      images: [
        {
          url: '/og?title=System+Vitals&subtitle=Live+ecosystem+scan',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: 'System Vitals | shawnos.ai',
      description: t('metadata.description'),
      images: ['/og?title=System+Vitals&subtitle=Live+ecosystem+scan'],
    },
  }
}

export default async function VitalsRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Vitals')
  const stats = getWebsiteStats(DATA_ROOT)

  if (!stats) {
    return (
      <>
        <PageHero compact title={t('heroTitle')} subtitle={t('heroSubtitle')} />
        <ScrollRevealSection background="var(--canvas)">
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
            {t('scannerNotInit')}
          </p>
        </ScrollRevealSection>
      </>
    )
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Vitals', url: 'https://shawnos.ai/vitals' }]} />
      <PageHero compact title={t('heroTitle')} subtitle={t('heroSubtitle')} />
      <VitalsPage stats={stats} />
    </>
  )
}
