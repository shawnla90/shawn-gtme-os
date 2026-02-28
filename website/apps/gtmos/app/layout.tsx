import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Navigation, NetworkBanner, Footer } from '@shawnos/shared/components'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const SITE_URL = 'https://thegtmos.ai'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'theGTMOS.ai',
    template: '%s | theGTMOS.ai',
  },
  description: 'The go-to-market operating system. GTM knowledge, Clay workflows, pipeline playbooks, and engineering guides - built in public.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'theGTMOS.ai',
    title: 'theGTMOS.ai',
    description: 'The go-to-market operating system. GTM knowledge, Clay workflows, pipeline playbooks, and engineering guides - built in public.',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'theGTMOS.ai',
    description: 'The go-to-market operating system. GTM knowledge, Clay workflows, pipeline playbooks, and engineering guides - built in public.',
    images: ['/og'],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'theGTMOS.ai — All Content' },
        { url: '/feed/knowledge.xml', title: 'theGTMOS.ai — Knowledge' },
        { url: '/feed/clay-wiki.xml', title: 'theGTMOS.ai — Clay Wiki' },
        { url: '/feed/how-to.xml', title: 'theGTMOS.ai — How-To' },
        { url: '/feed/daily-logs.xml', title: 'theGTMOS.ai — Daily Logs' },
        { url: '/feed/updates.xml', title: 'theGTMOS.ai — Latest Updates' },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

/* ── JSON-LD Structured Data ── */

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'theGTMOS.ai',
  url: SITE_URL,
  description: 'The go-to-market operating system. GTM knowledge, Clay workflows, pipeline playbooks, and engineering guides - built in public.',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navigation
          siteName="theGTMOS.ai"
          links={[
            { href: '/', label: 'Home' },
            { href: '/features', label: 'Features' },
            { href: '/how-to', label: 'How-To' },
            { href: '/knowledge/gtm', label: 'Knowledge' },
            { href: '/clay-wiki', label: 'Clay Wiki' },
            { href: '/mcp', label: 'MCP' },
            { href: 'https://thecontentos.ai/content-wiki', label: 'Content Wiki' },
            { href: '/log', label: 'Log' },
            { href: '/vitals', label: 'Vitals' },
            { href: '/updates', label: 'Updates' },
            { href: '/search', label: 'Search' },
          ]}
        />
        <main>{children}</main>
        <NetworkBanner currentSite="gtmos" />
        <Footer siteName="theGTMOS.ai" />
        <Analytics />
      </body>
    </html>
  )
}
