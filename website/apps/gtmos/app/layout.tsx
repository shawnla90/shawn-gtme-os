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
  description: 'The GTM operating system. Launching soon.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'theGTMOS.ai',
    title: 'theGTMOS.ai',
    description: 'The GTM operating system. Launching soon.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'theGTMOS.ai',
    description: 'The GTM operating system. Launching soon.',
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'theGTMOS.ai — All Content' },
        { url: '/feed/knowledge.xml', title: 'theGTMOS.ai — Knowledge' },
        { url: '/feed/clay-wiki.xml', title: 'theGTMOS.ai — Clay Wiki' },
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
    <html lang="en" className={jetbrains.variable}>
      <body>
        <Navigation
          siteName="theGTMOS.ai"
          links={[
            { href: '/', label: 'Home' },
            { href: '/how-to', label: 'How-To' },
            { href: '/knowledge/gtm', label: 'Knowledge' },
            { href: '/clay-wiki', label: 'Clay Wiki' },
            { href: 'https://thecontentos.ai/content-wiki', label: 'Content Wiki' },
            { href: '/log', label: 'Log' },
            { href: '/vitals', label: 'Vitals' },
            { href: '/updates', label: 'Updates' },
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
