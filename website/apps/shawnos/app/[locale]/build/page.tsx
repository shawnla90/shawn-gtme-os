import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { BuildContent } from './BuildContent'

export const metadata: Metadata = {
  title: 'Build With Me',
  description:
    'I build websites in a day. I build AI operating systems in a month. Full-stack web development and AI infrastructure — shipped fast, built to last.',
  keywords: [
    'AI developer for hire',
    'full stack web developer',
    'Next.js developer',
    'AI operating system',
    'website builder',
    'AI automation engineer',
    'GTM engineer',
    'Vercel developer',
    'AI agent development',
    'website deployment',
  ],
  alternates: { canonical: 'https://shawnos.ai/build' },
  openGraph: {
    title: 'Build With Me | shawnos.ai',
    description:
      'I build websites in a day. I build AI operating systems in a month.',
    url: 'https://shawnos.ai/build',
    images: [
      {
        url: '/og?title=Build+With+Me&subtitle=Websites+in+a+day.+AI+systems+in+a+month.',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Build With Me | shawnos.ai',
    description:
      'I build websites in a day. I build AI operating systems in a month.',
    images: [
      '/og?title=Build+With+Me&subtitle=Websites+in+a+day.+AI+systems+in+a+month.',
    ],
  },
}

export default function BuildPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Build With Me', url: 'https://shawnos.ai/build' }]}
      />
      <BuildContent />
    </>
  )
}
