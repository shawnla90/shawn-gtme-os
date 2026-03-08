import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { WebDevContent } from './WebDevContent'

const SITE_URL = 'https://shawnos.ai'

export const metadata: Metadata = {
  title: 'Web Development Services',
  description:
    'websites that load in under 1 second, rank on Google, and show you exactly what\'s working. Next.js sites for contractors, restaurants, agencies, and local businesses - every metric tracked, every result proven.',
  keywords: [
    'web development for small business',
    'contractor website design',
    'Next.js website for small business',
    'local business website cost',
    'fast loading business website',
    'Core Web Vitals website',
    'plumber website cost',
    'web development for plumbers',
    'HVAC website design',
    'WordPress alternative small business',
  ],
  alternates: { canonical: `${SITE_URL}/services/web-development` },
  openGraph: {
    title: 'Web Development Services | shawnos.ai',
    description:
      'websites that load in under 1 second, rank on Google, and show you exactly what\'s working.',
    url: `${SITE_URL}/services/web-development`,
    images: [
      {
        url: '/og?title=Web+Development+Services&subtitle=Does+your+website+have+proof%3F+Ours+does.',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Web Development Services | shawnos.ai',
    description:
      'websites that load in under 1 second, rank on Google, and show you exactly what\'s working.',
    images: [
      '/og?title=Web+Development+Services&subtitle=Does+your+website+have+proof%3F+Ours+does.',
    ],
  },
}

/* ── JSON-LD Structured Data ── */

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Web Development Services',
  description:
    'High-performance Next.js websites for businesses of all types - contractors, restaurants, agencies, retail, professional services. Every site built with Core Web Vitals compliance, analytics, and proven results.',
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
        description: '5-8 page Next.js site, mobile-optimized, lead capture, basic SEO, 1 month support.',
        price: '4500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Growth',
        description: 'Everything in Foundation plus AI chatbot, booking system, email automation, analytics, 3 months support.',
        price: '6500',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Dominance',
        description: 'Everything in Growth plus local SEO audit, schema markup, multi-location support, competitor analysis, 6 months support.',
        price: '8500',
        priceCurrency: 'USD',
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
      name: 'How much does a website for a plumbing business cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our packages start at $4,500 for a 5-8 page Next.js site with mobile optimization, lead capture forms, and basic SEO. Most service businesses choose the Growth package at $6,500 which includes a booking system, analytics, and 3 months of support. The investment typically pays for itself within 1-2 months through new leads.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why Next.js instead of WordPress?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WordPress sites average 4-6 seconds to load on mobile. Next.js sites load in under 1 second. After Google\'s February 2026 core update, page speed directly impacts your search rankings. A faster site means more visibility, more clicks, and more customers. Next.js also eliminates plugin vulnerabilities, requires no maintenance updates, and costs nothing to host on Vercel.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to build a website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most projects launch within 2-3 weeks. Simple sites (Foundation package) can be ready in as little as 1 week. We start with a strategy call, then move through design and development with your feedback at every stage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to know how to code?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. We handle everything - design, development, deployment, and ongoing support. You focus on running your business. We build the site that brings you customers.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after my site launches?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every package includes support (1-6 months depending on tier). We monitor your Core Web Vitals, track conversion metrics, and make adjustments to improve performance. You get a dashboard showing exactly how your site is performing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you help with Google Business Profile and local SEO?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Foundation package includes Google Business Profile setup. The Dominance package includes a full local SEO audit, schema markup for rich search results, and multi-location support. We make sure Google understands exactly what you do and where you do it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes your approach different from other web developers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Proof. Every site we build comes with measurable performance data - Core Web Vitals scores, load times, conversion tracking. We don\'t just build a pretty site and walk away. We build a site that performs, prove it with data, and keep optimizing. This page you\'re reading right now is built with the same technology and scores 95+ on Google PageSpeed.',
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
