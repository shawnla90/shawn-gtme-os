import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Navigation, NetworkBanner, Footer } from '@shawnos/shared/components'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const SITE_URL = 'https://shawnos.ai'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ShawnOS.ai',
    template: '%s | ShawnOS.ai',
  },
  description: 'GTM engineering, built in public. One monorepo. One operating system.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'ShawnOS.ai',
    title: 'ShawnOS.ai',
    description: 'GTM engineering, built in public. One monorepo. One operating system.',
    images: [{ url: '/og', width: 1200, height: 630, alt: 'ShawnOS.ai' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'ShawnOS.ai',
    description: 'GTM engineering, built in public. One monorepo. One operating system.',
    images: ['/og'],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': [
        { url: '/feed.xml', title: 'ShawnOS.ai — Blog' },
        { url: '/feed/all.xml', title: 'ShawnOS.ai — All Content' },
        { url: '/feed/knowledge.xml', title: 'ShawnOS.ai — Knowledge' },
        { url: '/feed/how-to.xml', title: 'ShawnOS.ai — How-To' },
        { url: '/feed/nio-terminal.xml', title: 'ShawnOS.ai — Nio Terminal' },
        { url: '/feed/daily-logs.xml', title: 'ShawnOS.ai — Daily Logs' },
        { url: '/feed/updates.xml', title: 'ShawnOS.ai — Latest Updates' },
      ],
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

/* ── JSON-LD Structured Data ── */

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Shawn Tenam',
  url: SITE_URL,
  jobTitle: 'GTM Engineer',
  description:
    'GTM engineer who builds AI-native pipelines, agent-driven workflows, and content systems that compound — all shipped from a single monorepo.',
  knowsAbout: [
    'GTM Engineering',
    'AI Agent Development',
    'Sales Operations',
    'Revenue Operations',
    'Pipeline Automation',
    'Cold Email Infrastructure',
    'LinkedIn Outreach Automation',
    'Data Enrichment Pipelines',
    'Content-as-Code Publishing',
    'Next.js',
    'TypeScript',
    'Python',
    'Vercel Deployment',
    'Monorepo Architecture',
    'Clay Workflows',
    'HubSpot Automation',
    'MCP Servers',
    'Cursor IDE',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'GTM Engineer',
    description:
      'Designs and builds go-to-market infrastructure — AI-native pipelines, enrichment workflows, outbound automation, and content systems.',
    skills:
      'Clay, HeyReach, Instantly, HubSpot, Next.js, TypeScript, Python, Vercel, Cursor IDE, Claude AI',
    occupationLocation: {
      '@type': 'Country',
      name: 'US',
    },
  },
  alumniOf: [
    {
      '@type': 'Organization',
      name: 'Plumbing Industry',
      description: 'Licensed plumber turned GTM engineer — career pivot from trades to tech',
    },
    {
      '@type': 'Role',
      roleName: 'SDR / BDR',
      description: 'Sales development representative building outbound systems and pipeline automation',
    },
  ],
  sameAs: [
    'https://linkedin.com/in/shawntenam',
    'https://x.com/shawntenam',
    'https://shawntenam.substack.com',
    'https://github.com/shawnla90',
    'https://thegtmos.ai',
    'https://thecontentos.ai',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ShawnOS.ai',
  url: SITE_URL,
  description: 'GTM engineering, built in public. One monorepo. One operating system.',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navigation
          siteName="ShawnOS.ai"
          links={[
            { href: '/', label: 'Home' },
            { href: '/blog', label: 'Blog' },
            { href: '/how-to', label: 'How-To' },
            { href: '/log', label: 'Log' },
            { href: '/knowledge', label: 'Knowledge' },
            { href: '/clay-wiki', label: 'Clay Wiki' },
            { href: '/content-wiki', label: 'Content Wiki' },
            { href: '/context-wiki', label: 'Context Wiki' },
            { href: '/rpg-preview', label: 'RPG' },
            { href: '/vitals', label: 'Vitals' },
            { href: '/updates', label: 'Updates' },
            { href: '/about', label: 'About' },
            { href: '/arc', label: 'Arc' },
            { href: '/method', label: 'Method' },
            { href: '/api', label: 'API' },
          ]}
        />
        <main>{children}</main>
        <NetworkBanner currentSite="shawnos" />
        <Footer siteName="ShawnOS.ai" />
        <Analytics />
      </body>
    </html>
  )
}
