import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { WebDevContent } from './WebDevContent'

const SITE_URL = 'https://shawnos.ai'

export const metadata: Metadata = {
  title: 'Web Development Services',
  description:
    'Custom websites for service businesses starting at $3,500. Sites that load in under 1 second, rank on Google, and show you exactly where your next customer came from. Multi-language support available.',
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
  alternates: { canonical: `${SITE_URL}/services/web-development` },
  openGraph: {
    title: 'Web Development Services | shawnos.ai',
    description:
      'Custom websites for service businesses starting at $3,500. Load in under 1 second, rank on Google, track every lead.',
    url: `${SITE_URL}/services/web-development`,
    images: [
      {
        url: '/og?title=Web+Development+Services&subtitle=Your+website+looks+fine.+It%27s+losing+you+money.',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Web Development Services | shawnos.ai',
    description:
      'Custom websites for service businesses starting at $3,500. Load in under 1 second, rank on Google, track every lead.',
    images: [
      '/og?title=Web+Development+Services&subtitle=Your+website+looks+fine.+It%27s+losing+you+money.',
    ],
  },
}

/* ── JSON-LD Structured Data ── */

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Web Development Services',
  description:
    'High-performance custom websites for service businesses - contractors, restaurants, agencies, retail, professional services. Every site built with Core Web Vitals compliance, analytics, and proven results.',
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
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Web Development Packages',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Foundation',
        description: '5-7 page custom website, mobile-optimized, lead capture, basic SEO, 1 month support.',
        price: '3500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Growth',
        description: 'Everything in Foundation plus 8-12 pages, bilingual support, AI chatbot, booking system, analytics, 3 months support.',
        price: '5500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Dominance',
        description: 'Everything in Growth plus 12-20 pages, 3+ languages, full SEO audit, schema markup, Google Ads consultation, 6 months support.',
        price: '8500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Managed',
        description: 'Ongoing monthly management including content updates, SEO optimization, analytics reporting, and Google Ads management.',
        price: '500',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '500',
          priceCurrency: 'USD',
          billingIncrement: 1,
          unitCode: 'MON',
        },
      },
    ],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a website for a service business cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our packages start at $3,500 for a 5-7 page custom site with mobile optimization, lead capture forms, and basic SEO. Most service businesses choose the Growth package at $5,500 which adds a booking system, bilingual support, analytics, and 3 months of support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why not just use WordPress like everyone else?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WordPress sites average 4-6 seconds to load on mobile. Our sites load in under 1 second. After Google\'s February 2026 core update, page speed directly impacts your search rankings. A faster site means more visibility, more clicks, and more customers. Our approach also eliminates plugin vulnerabilities, requires no maintenance updates, and costs nothing to host.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Foundation sites launch in 1-2 weeks. Growth sites take 2-3 weeks. Dominance projects run 3-4 weeks. We start with a strategy call, then move through design and development with your feedback at every stage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to know anything about technology?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. We handle everything - design, development, hosting, and ongoing support. You focus on running your business. We build the site that brings you customers.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does "support" actually mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'During your support period, we monitor your site speed, fix any issues, make content updates, track your analytics, and optimize for better results. You can reach us directly for changes. It is not a call center - it is the same team that built your site.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after my support period ends?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your site keeps running exactly as it was. Hosting is free, so there are no ongoing costs unless you want them. You can upgrade to the Managed plan for ongoing optimization, or self-manage. The site is yours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you build sites in other languages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Growth package includes bilingual support (English + Spanish). The Dominance package supports 3 or more languages. Every language gets its own optimized pages - not just a translation plugin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you help with Google Business Profile and local search?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Foundation package includes Google Business Profile setup. The Dominance package includes a full local SEO audit, schema markup for rich search results, and multi-location support.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does ongoing management cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our Managed plan runs $500-$1,000/month depending on scope. It includes ongoing content updates, SEO optimization, analytics reporting, and priority support. Most businesses start with a build package and add Managed later once they see results.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes you different from other web developers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Proof. Every site we build comes with measurable performance data - load times, search rankings, conversion tracking. We don\'t just build a site and walk away. We build a site that performs, prove it with data, and keep optimizing.',
      },
    },
  ],
}

export default function WebDevPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Services', url: `${SITE_URL}/services` },
          { name: 'Web Development', url: `${SITE_URL}/services/web-development` },
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
      <WebDevContent />
    </>
  )
}
