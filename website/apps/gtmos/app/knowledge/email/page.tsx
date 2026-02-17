import type { Metadata } from 'next'
import { EmailInfrastructureGuidePage } from '@shawnos/shared/pages/EmailInfrastructureGuidePage'
import { EMAIL_CATEGORIES } from '@shawnos/shared/data/email-infrastructure'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'

export const metadata: Metadata = {
  title: 'Email Infrastructure Guide | Domains, Warmup & Deliverability',
  description:
    'Secondary domains, DNS records, inbox providers, MX routing, sending limits, domain warming, campaign math, and the email infrastructure you need to send cold email that actually lands in 2026.',
  keywords: [
    'email infrastructure',
    'cold email setup',
    'domain warming',
    'inbox providers',
    'email deliverability',
    'secondary domains',
    'SPF DKIM DMARC',
    'MX records',
    'sending limits',
    'mailbox rotation',
    'instantly',
    'heyreach',
    'campaign math',
  ],
  alternates: { canonical: `${SITE_URL}/knowledge/email` },
  openGraph: {
    title: 'Email Infrastructure Guide | theGTMOS.ai',
    description:
      'Domains, DNS, inbox providers, warmup, rotation, and the email infrastructure explained from the builder side.',
    url: `${SITE_URL}/knowledge/email`,
  },
  twitter: {
    title: 'Email Infrastructure Guide | theGTMOS.ai',
    description:
      'Domains, DNS, inbox providers, warmup, rotation, and the email infrastructure explained from the builder side.',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: EMAIL_CATEGORIES.flatMap((cat) =>
    cat.terms.map((term) => ({
      '@type': 'Question',
      name: `What is ${term.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${term.definition} ${term.whyItMatters.slice(0, 300)}`,
      },
    })),
  ),
}

export default function Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'Email Infrastructure', url: `${SITE_URL}/knowledge/email` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <EmailInfrastructureGuidePage />
    </>
  )
}
