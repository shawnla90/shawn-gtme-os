import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { WebDevContent } from './WebDevContent'
import { getTranslations, isValidLocale } from './i18n'
import type { Locale } from './i18n/types'

const SITE_URL = 'https://shawnos.ai'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en'
  const t = getTranslations(validLocale)

  const localeTitle: Record<Locale, string> = {
    en: 'Web Development Services',
    he: 'שירותי פיתוח אתרי אינטרנט',
    es: 'Servicios de Desarrollo Web',
    zh: '网站开发服务',
    ja: 'ウェブ開発サービス',
  }

  const localeDesc: Record<Locale, string> = {
    en: 'Custom websites for service businesses starting at $3,500. Sites that load in under 1 second, rank on Google, and show you exactly where your next customer came from. Multi-language support available.',
    he: 'אתרים מותאמים אישית לעסקי שירותיים החל מ-$3,500. אתרים שנטענים בפחות משנייה, מדורגים ב-Google, ומראים לכם בדיוק מאיפה הגיע הלקוח הבא.',
    es: 'Sitios web personalizados para negocios de servicios desde $3,500. Sitios que cargan en menos de 1 segundo, aparecen en Google y le muestran exactamente de dónde vino su próximo cliente.',
    zh: '为服务型企业定制网站，起价$3,500。加载速度不到1秒，在Google上获得排名，并精确追踪您的下一个客户来源。支持多语言。',
    ja: 'サービス業向けカスタムウェブサイト、$3,500から。1秒未満で読み込み、Googleで上位表示、次の顧客がどこから来たか正確に把握。多言語対応。',
  }

  return {
    title: localeTitle[validLocale],
    description: localeDesc[validLocale],
    keywords: [
      'web development for small business',
      'contractor website design',
      'Next.js website for small business',
      'local business website cost',
      'fast loading business website',
      'Core Web Vitals website',
      'service business website',
      'HVAC website design',
      'WordPress alternative small business',
      'multi-language website',
      'bilingual business website',
    ],
    alternates: {
      canonical: `${SITE_URL}/services/web-development`,
      languages: {
        'en': `${SITE_URL}/services/web-development`,
        'he': `${SITE_URL}/he/services/web-development`,
        'es': `${SITE_URL}/es/services/web-development`,
        'ja': `${SITE_URL}/ja/services/web-development`,
        'x-default': `${SITE_URL}/services/web-development`,
      },
    },
    openGraph: {
      title: `${localeTitle[validLocale]} | shawnos.ai`,
      description: localeDesc[validLocale],
      url: validLocale === 'en'
        ? `${SITE_URL}/services/web-development`
        : `${SITE_URL}/${validLocale}/services/web-development`,
      locale: validLocale === 'he' ? 'he_IL' : validLocale === 'es' ? 'es_US' : validLocale === 'ja' ? 'ja_JP' : validLocale === 'zh' ? 'zh_CN' : 'en_US',
      images: [
        {
          url: '/og?title=Web+Development+Services&subtitle=Your+website+looks+fine.+It%27s+losing+you+money.',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: `${localeTitle[validLocale]} | shawnos.ai`,
      description: localeDesc[validLocale],
      images: [
        '/og?title=Web+Development+Services&subtitle=Your+website+looks+fine.+It%27s+losing+you+money.',
      ],
    },
  }
}

export default async function WebDevPage({ params }: Props) {
  const { locale } = await params
  const validLocale: Locale = isValidLocale(locale) ? locale : 'en'

  setRequestLocale(locale)

  const t = getTranslations(validLocale)

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${t.hero.headlineLine1} ${t.hero.headlineLine2}`,
    description: t.hero.description,
    provider: {
      '@type': 'Person',
      name: 'Shawn Tenam',
      url: SITE_URL,
    },
    serviceType: 'Web Development',
    areaServed: {
      '@type': 'Country',
      name: 'US',
    },
    inLanguage: validLocale,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Web Development Packages',
      itemListElement: t.pricing.tiers.map((tier) => ({
        '@type': 'Offer',
        name: tier.name,
        description: tier.features.join(', '),
        price: tier.price.replace(/[^0-9]/g, ''),
        priceCurrency: 'USD',
      })),
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }

  const breadcrumbLabels: Record<Locale, { service: string; page: string }> = {
    en: { service: 'Services', page: 'Web Development' },
    he: { service: 'שירותים', page: 'פיתוח אתרי אינטרנט' },
    es: { service: 'Servicios', page: 'Desarrollo Web' },
    zh: { service: '服务', page: '网站开发' },
    ja: { service: 'サービス', page: 'ウェブ開発' },
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: breadcrumbLabels[validLocale].service, url: `${SITE_URL}/services` },
          { name: breadcrumbLabels[validLocale].page, url: `${SITE_URL}/services/web-development` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <WebDevContent t={t} locale={validLocale} />
    </>
  )
}
