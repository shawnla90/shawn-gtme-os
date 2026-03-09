import type { Metadata } from 'next'

const SITE_URL = 'https://shawnos.ai'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ShawnOS.ai',
    template: '%s | ShawnOS.ai',
  },
  description: 'GTM engineering, built in public. One monorepo. One operating system.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ShawnOS.ai',
    title: 'ShawnOS.ai',
    description: 'GTM engineering, built in public. One monorepo. One operating system.',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'ShawnOS.ai' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'ShawnOS.ai',
    description: 'GTM engineering, built in public. One monorepo. One operating system.',
    images: ['/og'],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'ShawnOS.ai — Blog' },
        { url: '/feed/all.xml', title: 'ShawnOS.ai — All Content' },
        { url: '/feed/knowledge.xml', title: 'ShawnOS.ai — Knowledge' },
        { url: '/feed/how-to.xml', title: 'ShawnOS.ai — How-To' },
        { url: '/feed/nio-terminal.xml', title: 'ShawnOS.ai — Nio Terminal' },
        { url: '/feed/daily-logs.xml', title: 'ShawnOS.ai — Daily Logs' },
        { url: '/feed/geo.xml', title: 'ShawnOS.ai — GEO Wiki' },
        { url: '/feed/updates.xml', title: 'ShawnOS.ai — Latest Updates' },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
