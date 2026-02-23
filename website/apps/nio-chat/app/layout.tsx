import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import PWARegistration from './components/PWARegistration'
import './globals.css'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NioBot',
  description: 'Multi-agent AI assistant powered by ShawnOS',
  applicationName: 'NioBot',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NioBot',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0D1117',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jetbrains.variable}>
      <body>
        {children}
        <PWARegistration />
      </body>
    </html>
  )
}
