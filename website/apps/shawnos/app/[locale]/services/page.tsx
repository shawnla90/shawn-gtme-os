import type { Metadata } from 'next'
import { ServicesContent } from './ServicesContent'

const SITE_URL = 'https://shawnos.ai'

export const metadata: Metadata = {
  title: 'Services | ShawnOS.ai',
  description:
    'Web development, AI enablement, and Reddit growth engineering for SaaS founders and GTM teams. Systems that compound. No rate cards.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    type: 'website',
    title: 'Services | ShawnOS.ai',
    description:
      'Web development, AI enablement, and Reddit growth engineering. Systems that compound.',
    url: `${SITE_URL}/services`,
    images: [
      {
        url: `/og?title=${encodeURIComponent('Services')}&subtitle=${encodeURIComponent('Systems that compound')}`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'ShawnOS',
  url: SITE_URL,
  description:
    'GTM engineering studio building AI-native pipelines, content systems, and go-to-market infrastructure.',
  provider: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description:
            'Next.js performance sites with SEO, analytics, and lead capture built in.',
          url: `${SITE_URL}/services/web-development`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Enablement',
          description:
            'Claude Code workflows, MCP servers, agent pipelines, and AI-native GTM infrastructure.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Reddit Growth (GEO)',
          description:
            'Generative Engine Optimization through authentic Reddit authority building.',
          url: `${SITE_URL}/reddit`,
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
      name: 'How is this different from hiring an agency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Agencies sell hours. I sell outcomes. You get a fixed scope, a fixed price, and a working system. I build the infrastructure myself using AI-accelerated development, which means you get senior-level architecture at a fraction of the timeline.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does AI enablement actually mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It means your team stops copy-pasting into ChatGPT and starts shipping with AI built into their workflow. I set up Claude Code with custom instructions for your codebase, build MCP servers that connect your tools, create agent pipelines for repetitive work, and train your team to use all of it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the Reddit growth service work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI search engines like Perplexity, ChatGPT, and Gemini pull heavily from Reddit. I build authentic authority in your niche subreddits through real engagement. Content strategy mapped to keyword clusters, karma building, and community presence that gets your brand cited by AI models.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do your websites cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom sites start at $3,500 for a 5-7 page build with SEO, analytics, and lead capture included. The most popular package is $5,500 which adds bilingual support, booking systems, and 3 months of post-launch support.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast can you ship?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A production website ships in 1-2 weeks. A full AI operating system takes 4-8 weeks. Everything is scoped upfront so there are no surprises.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after the project is done?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your site keeps running with zero ongoing cost. Hosting is free on Vercel. You can self-manage, or upgrade to a managed plan for ongoing optimization, content updates, and priority support. The code is yours either way.',
      },
    },
  ],
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicesContent />
    </>
  )
}
