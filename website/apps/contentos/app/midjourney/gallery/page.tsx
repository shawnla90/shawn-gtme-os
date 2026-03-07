import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'
import { GalleryContent } from './GalleryContent'

const SITE_URL = SITES.contentos

export const metadata: Metadata = {
  title:
    'MidJourney Gallery & Prompt Builder - AI Art Showcase',
  description:
    'Browse MidJourney art with full prompts, filter by technique, and build your own prompts with the interactive prompt builder. CREF, OREF, SREF examples included.',
  keywords: [
    'midjourney gallery',
    'midjourney prompts',
    'prompt builder',
    'AI art gallery',
    'CREF examples',
    'OREF examples',
    'SREF examples',
    'midjourney showcase',
    'prompt engineering tool',
  ],
  alternates: { canonical: `${SITE_URL}/midjourney/gallery` },
  openGraph: {
    title: 'MidJourney Gallery & Prompt Builder | theContentOS.ai',
    description:
      'Browse AI art with full prompts and build your own with the interactive prompt builder.',
    url: `${SITE_URL}/midjourney/gallery`,
    images: [
      {
        url: '/og?title=MidJourney+Gallery&subtitle=Prompt+Builder+%26+Art+Showcase',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MidJourney Gallery & Prompt Builder | theContentOS.ai',
    description:
      'Browse AI art with full prompts and build your own with the interactive prompt builder.',
    images: [
      '/og?title=MidJourney+Gallery&subtitle=Prompt+Builder+%26+Art+Showcase',
    ],
  },
}

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'MidJourney Mastery', url: `${SITE_URL}/midjourney` },
          { name: 'Gallery', url: `${SITE_URL}/midjourney/gallery` },
        ]}
      />
      <GalleryContent />
    </>
  )
}
