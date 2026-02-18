import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Navigation, NetworkBanner, Footer } from '@shawnos/shared/components'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const SITE_URL = 'https://thecontentos.ai'

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
  description: 'The content operating system. Launching soon.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'theContentOS.ai',
    title: 'theContentOS.ai',
    description: 'The content operating system. Launching soon.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'theContentOS.ai',
    description: 'The content operating system. Launching soon.',
  },
  alternates: {
    canonical: SITE_URL,
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
          siteName="theContentOS.ai"
          links={[
            { href: '/', label: 'Home' },
            { href: '/how-to', label: 'How-To' },
            { href: '/content-wiki', label: 'Content Wiki' },
            { href: 'https://shawnos.ai/knowledge', label: 'Knowledge' },
            { href: 'https://thegtmos.ai/clay-wiki', label: 'Clay Wiki' },
            { href: '/log', label: 'Log' },
            { href: '/vitals', label: 'Vitals' },
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
