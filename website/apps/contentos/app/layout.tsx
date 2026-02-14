import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { TerminalChrome, Navigation, NetworkBanner, Footer } from '@shawnos/shared/components'
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
    default: 'thecontentos.ai',
    template: '%s | thecontentos.ai',
  },
  description: 'The content operating system. Launching soon.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'thecontentos.ai',
    title: 'thecontentos.ai',
    description: 'The content operating system. Launching soon.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'thecontentos.ai',
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
        <TerminalChrome title="thecontentos.ai">
          <Navigation
            siteName="thecontentos.ai"
            links={[
              { href: '/', label: 'Home' },
              { href: '/log', label: 'Log' },
            ]}
          />
          <main>{children}</main>
          <NetworkBanner currentSite="contentos" />
          <Footer siteName="thecontentos.ai" />
        </TerminalChrome>
      </body>
    </html>
  )
}
