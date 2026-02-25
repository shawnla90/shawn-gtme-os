import type { Metadata } from 'next'
import './globals.css'
import Sidebar from './components/Sidebar'

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
