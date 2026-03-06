import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'
import { ShowcaseContent } from './ShowcaseContent'

const SITE_URL = SITES.contentos

export const metadata: Metadata = {
  title: 'Showcase - Content Tools Built in React',
  description:
    'Ten interactive React demos that prove content operations are infrastructure, not decoration. Anti-slop detector, platform formatter, content pillar map, recursive content loop, and more.',
  keywords: [
    'content operations showcase',
    'react content components',
    'anti-slop detector',
    'platform content formatter',
    'content pillar map',
    'recursive content loop',
    'content OS',
    'voice DNA',
    'content pipeline demo',
  ],
  alternates: { canonical: `${SITE_URL}/showcase` },
  openGraph: {
    title: 'Showcase - Content Tools Built in React | theContentOS.ai',
    description:
      'Ten interactive React demos. Anti-slop detector, platform formatter, content pillars, recursive loops.',
    url: `${SITE_URL}/showcase`,
  },
  twitter: {
    card: 'summary',
    title: 'Showcase - Content Tools Built in React | theContentOS.ai',
    description:
      'Ten interactive React demos. Content operations as infrastructure.',
  },
}

export default function ShowcasePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Showcase', url: `${SITE_URL}/showcase` },
        ]}
      />
      <ShowcaseContent />
    </>
  )
}
