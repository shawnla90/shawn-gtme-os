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
      'Shawn Tenam',
      'Shawn Tenam GTM engineer',
      'GTM engineer',
      'go-to-market engineer',
      'Clay certified creator',
      'Clay practitioner',
      'revenue operations engineer',
      'GTM systems architect',
      'go-to-market automation',
      'AI-native development',
      'independent GTM consultant',
      'Lead Alchemy',
    ],
    alternates: { canonical: 'https://shawnos.ai/about' },
    openGraph: {
      title: t('metadata.ogTitle'),
      description: t('metadata.ogDescription'),
      url: 'https://shawnos.ai/about',
      images: [{ url: '/og?title=Shawn+Tenam&subtitle=GTM+Engineer.+Independent.+Clay+Certified+Creator.', width: 1200, height: 630 }],
    },
    twitter: {
      title: t('metadata.ogTitle'),
      description: t('metadata.ogDescription'),
      images: ['/og?title=Shawn+Tenam&subtitle=GTM+Engineer.+Independent.+Clay+Certified+Creator.'],
    },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Shawn Tenam',
    jobTitle: 'GTM Engineer',
    url: 'https://shawnos.ai',
    sameAs: [
      'https://linkedin.com/in/shawntenam',
      'https://x.com/shawntenam',
      'https://github.com/shawnla90',
      'https://reddit.com/r/GTMBuilders',
      'https://shawntenam.substack.com',
      'https://thegtmos.ai',
      'https://thecontentos.ai',
    ],
    knowsAbout: [
      'Go-to-market engineering',
      'Clay data enrichment',
      'Sales pipeline automation',
      'AI-native development',
      'Content operating systems',
    ],
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'About Shawn Tenam', url: 'https://shawnos.ai/about' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AboutContent />
    </>
  )
}
