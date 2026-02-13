import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { TerminalChrome, Navigation, NetworkBanner, Footer } from '@shawnos/shared/components'
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
    default: 'thegtmos.ai',
    template: '%s | thegtmos.ai',
  },
  description: 'The GTM operating system. Launching soon.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'thegtmos.ai',
    title: 'thegtmos.ai',
    description: 'The GTM operating system. Launching soon.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'thegtmos.ai',
    description: 'The GTM operating system. Launching soon.',
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
        <TerminalChrome title="thegtmos.ai">
          <Navigation
            siteName="thegtmos.ai"
            links={[{ href: '/', label: 'Home' }]}
          />
          <main>{children}</main>
          <NetworkBanner currentSite="gtmos" />
          <Footer siteName="thegtmos.ai" />
        </TerminalChrome>
      </body>
    </html>
  )
}
