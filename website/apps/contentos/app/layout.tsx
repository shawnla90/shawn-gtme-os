import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import { Navigation, NetworkBanner, Footer, CursorGlow, PostHogProvider } from '@shawnos/shared/components'
import { ThemeProvider } from '@shawnos/shared/hooks/useTheme'
import { Analytics } from '@vercel/analytics/next'
import { RemChat } from './RemChat'
import './globals.css'

const SITE_URL = 'https://thecontentos.ai'

const satoshi = localFont({
  src: [
    { path: '../public/fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
  ],
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
    default: 'theContentOS.ai — Best Self-Hosted AI Coding Assistant & Content OS',
    template: '%s | theContentOS.ai',
  },
  description: 'A free AI agent automation tool for content creators. Set up AI agent automation fast — Voice DNA, context playbooks, and AI agent setup as a system.',
  keywords: ['free ai agent automation tool', 'ai agent setup', 'content operating system', 'ai automation'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'theContentOS.ai',
    title: 'theContentOS.ai — Best Self-Hosted AI Coding Assistant & Content OS',
    description: 'A free AI agent automation tool for content creators. Set up AI agent automation fast — Voice DNA, context playbooks, and AI agent setup as a system.',
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@shawntenam',
    creator: '@shawntenam',
    title: 'theContentOS.ai — Best Self-Hosted AI Coding Assistant & Content OS',
    description: 'The best self-hosted AI coding assistant and content OS. Build a personal AI with memory that knows your voice — Voice DNA, context playbooks, and content ops as a system.',
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

/* ── JSON-LD Structured Data ── */

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Content OS',
  url: SITE_URL,
  description: 'The content operating system. Voice DNA, context playbooks, and content ops - your content strategy as a system, not a calendar.',
  founder: {
    '@type': 'Person',
    name: 'Shawn Tenam',
    url: 'https://shawnos.ai',
  },
  sameAs: [
    'https://shawnos.ai',
    'https://thegtmos.ai',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'theContentOS.ai',
  url: SITE_URL,
  description: 'The content operating system. Voice DNA, context playbooks, and content ops - your content strategy as a system, not a calendar.',
  author: { '@type': 'Person', name: 'Shawn Tenam' },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a content operating system?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A content operating system is a code-based infrastructure for creating, distributing, and compounding content across platforms. Instead of a content calendar or spreadsheet, you build voice rules, platform playbooks, and production pipelines in version-controlled files.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Voice DNA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Voice DNA is the foundational layer of the 3-tier system. It encodes your cadence, vocabulary, anti-patterns, and identity markers into files that AI agents read before generating any content. Same voice, every platform, every time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do platform playbooks work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each platform gets its own playbook that inherits from your Voice DNA. The LinkedIn playbook knows paragraph structure, emoji usage, and CTA patterns. The TikTok playbook knows 16-second structures and hook formats. Same voice, different container.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the recursive feedback loop work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every published post teaches the system. Performance data feeds back into voice rules. When the anti-slop guide catches a new pattern, it gets added. When a hook style outperforms, it gets documented. The 100th post is easier than the 1st.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I build my own Content OS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. The wiki, how-to guides, and method page document the entire system. Start with Voice DNA (who you are), add platform playbooks (how you adapt), then build content ops (how you ship). Everything here is public.',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${satoshi.variable} ${jetbrains.variable}`}>
      <body>
        <ThemeProvider>
        <PostHogProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
          <Navigation
            siteName="theContentOS.ai"
            links={[
              {
                href: '#', label: 'Explore', children: [
                  { href: '/', label: 'Home' },
                  { href: '/services', label: 'Services' },
                  { href: '/how-to', label: 'How-To' },
                  { href: '/content-wiki', label: 'Content Wiki' },
                  { href: 'https://shawnos.ai/knowledge', label: 'Knowledge' },
                  { href: 'https://thegtmos.ai/clay-wiki', label: 'Clay Wiki' },
                  { href: '/method', label: 'Method' },
                  { href: '/showcase', label: 'Showcase' },
                  { href: '/anti-slop', label: 'Anti-Slop' },
                  { href: '/search', label: 'Search' },
                  { href: '/log', label: 'Log' },
                  { href: '/vitals', label: 'Vitals' },
                  { href: '/posts', label: 'Posts' },
                  { href: '/updates', label: 'Updates' },
                ],
              },
            ]}
          />
          <CursorGlow />
          <main>{children}</main>
          <NetworkBanner currentSite="contentos" />
          <Footer siteName="theContentOS.ai" />
          <RemChat />
          <Analytics />
        </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
