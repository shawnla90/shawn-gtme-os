import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import Sidebar from './components/Sidebar'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mission Control | GTM OS',
  description: 'Command center for your AI operating system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${jetbrainsMono.variable} ${inter.variable}`}>
      <body className="bg-black text-green-400 font-mono min-h-screen antialiased">
        <Sidebar />
        <div className="lg:pl-[220px]">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
