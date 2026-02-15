import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Navigation, NetworkBanner, Footer } from '@shawnos/shared/components'
import './globals.css'

const SITE_URL = 'https://shawnos.ai'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

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
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

/* ── JSON-LD Structured Data ── */

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Shawn Tenam',
  url: SITE_URL,
  jobTitle: 'GTM Engineer',
  sameAs: [
    'https://linkedin.com/in/shawntenam',
    'https://x.com/shawntenam',
    'https://shawntenam.substack.com',
    'https://github.com/shawnla90',
    'https://thegtmos.ai',
    'https://thecontentos.ai',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ShawnOS.ai',
  url: SITE_URL,
  description: 'GTM engineering, built in public. One monorepo. One operating system.',
  author: { '@type': 'Person', name: 'Shawn Tenam' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrains.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navigation
          siteName="ShawnOS.ai"
          links={[
            { href: '/', label: 'Home' },
            { href: '/blog', label: 'Blog' },
            { href: '/log', label: 'Log' },
            { href: '/rpg-preview', label: 'RPG' },
            { href: '/about', label: 'About' },
            { href: '/api', label: 'API' },
          ]}
        />
        <main>{children}</main>
        <NetworkBanner currentSite="shawnos" />
        <Footer siteName="ShawnOS.ai" />
      </body>
    </html>
  )
}
