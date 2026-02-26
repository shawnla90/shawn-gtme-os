import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Navigation, NetworkBanner, Footer } from '@shawnos/shared/components'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const SITE_URL = 'https://thecontentos.ai'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'theContentOS.ai',
    template: '%s | theContentOS.ai',
  },
  description: 'The content operating system. Voice DNA, context playbooks, and content ops - your content strategy as a system, not a calendar.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'theContentOS.ai',
    title: 'theContentOS.ai',
    description: 'The content operating system. Voice DNA, context playbooks, and content ops - your content strategy as a system, not a calendar.',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'theContentOS.ai',
    description: 'The content operating system. Voice DNA, context playbooks, and content ops - your content strategy as a system, not a calendar.',
    images: ['/og'],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'theContentOS.ai — All Content' },
        { url: '/feed/content-wiki.xml', title: 'theContentOS.ai — Content Wiki' },
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
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <Navigation
          siteName="theContentOS.ai"
          links={[
            { href: '/', label: 'Home' },
            { href: '/how-to', label: 'How-To' },
            { href: '/content-wiki', label: 'Content Wiki' },
            { href: 'https://shawnos.ai/knowledge', label: 'Knowledge' },
            { href: 'https://thegtmos.ai/clay-wiki', label: 'Clay Wiki' },
            { href: '/method', label: 'Method' },
            { href: '/showcase', label: 'Showcase' },
            { href: '/search', label: 'Search' },
            { href: '/log', label: 'Log' },
            { href: '/vitals', label: 'Vitals' },
            { href: '/updates', label: 'Updates' },
          ]}
        />
        <main>{children}</main>
        <NetworkBanner currentSite="contentos" />
        <Footer siteName="theContentOS.ai" />
        <Analytics />
      </body>
    </html>
  )
}
