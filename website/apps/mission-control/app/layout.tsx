import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en" className="dark">
      <body className="bg-black text-green-400 font-mono min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-2xl">🤖</div>
              <h1 className="text-3xl font-bold text-green-300">MISSION CONTROL</h1>
              <div className="flex-1"></div>
              <div className="text-sm text-green-500">
                STATUS: <span className="text-green-400">ONLINE</span>
              </div>
            </div>
            <div className="h-px bg-green-800 mb-6"></div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}