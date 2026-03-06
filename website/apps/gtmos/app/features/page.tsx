import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'
import { ToolsClient } from './ToolsClient'

const SITE_URL = SITES.gtmos

export const metadata: Metadata = {
  title: 'Features - Email Deliverability Tools',
  description:
    'Free email deliverability tools - MX record checker, sending volume calculator, domain health scorer, warmup timeline planner. Built for GTM engineers.',
  alternates: { canonical: `${SITE_URL}/features` },
  openGraph: {
    title: 'Features - Email Deliverability Tools | theGTMOS.ai',
    description:
      'Free email deliverability tools for GTM engineers. Check MX records, calculate sending capacity, score domain health, plan warmup timelines.',
    url: `${SITE_URL}/features`,
  },
}

export default function FeaturesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Features', url: `${SITE_URL}/features` }]}
      />
      <ToolsClient />
    </>
  )
}
