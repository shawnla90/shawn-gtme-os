import type { Metadata } from 'next'
import {
  HOW_TO_WIKI_ENTRIES,
  HOW_TO_WIKI_CATEGORIES,
} from '@shawnos/shared/data/how-to-wiki'
import { HowToWikiPage } from '@shawnos/shared/pages/HowToWikiPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thecontentos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'How-To Wiki | AI Content Stack Guides',
  description:
    'Step-by-step guides for building an AI-powered content operating system. MCP content stacks, publishing workflows, voice systems, and tools that compound.',
  keywords: [
    'how to use AI for content',
    'MCP content stack',
    'AI content workflow',
    'content operating system guides',
    'AI publishing tools',
    'content creation AI tutorial',
  ],
  alternates: { canonical: `${SITE_URL}/how-to` },
  openGraph: {
    title: 'How-To Wiki | AI Content Stack Guides',
    description:
      'Step-by-step guides for building an AI-powered content operating system. MCP content stacks, publishing workflows, and tools that compound.',
    url: `${SITE_URL}/how-to`,
  },
  twitter: {
    title: 'How-To Wiki | AI Content Stack Guides',
    description:
      'Step-by-step guides for building an AI-powered content operating system. MCP content stacks, publishing workflows, and tools that compound.',
  },
}

/* ── FAQ schema ───────────────────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do you set up MCP servers for content creation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Connect your publishing tools (Typefully, Substack), audio tools (ElevenLabs), and knowledge sync (Notion) via MCP servers. Each server bridges your AI agent to an external tool so you can draft, finalize, and publish content without leaving the IDE.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is an AI content operating system?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An AI content operating system is a repo-based workflow where drafts, final copy, images, and publishing live in version-controlled folders. Skills automate the pipeline from idea to published post across LinkedIn, X, Substack, and TikTok.',
      },
    },
  ],
}

/* ── page ─────────────────────────────────────────── */

export default function ContentOSHowToPage() {
  const entries = HOW_TO_WIKI_ENTRIES.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.subtitle,
    category: e.category,
    difficulty: e.difficulty,
    canonicalSite: e.canonicalSite,
  }))

  const categories = HOW_TO_WIKI_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    prompt: c.prompt,
  }))

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'How-To Wiki', url: `${SITE_URL}/how-to` }]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HowToWikiPage
        config={{
          siteName: 'contentos',
          siteUrl: SITE_URL,
          title: 'How-To Wiki',
          description:
            'Step-by-step guides for AI-powered content workflows. MCP content stacks, publishing pipelines, voice systems, and the tools that turn your repo into a content engine.',
          terminalCommand: 'cd ~/how-to --site=contentos',
          badge: 'CONTENT STACK GUIDES',
          entries,
          categories,
          statOverride: { label: 'Content Tools', value: '4' },
          navLinks: {
            left: { href: '/content-wiki', label: 'content wiki' },
            right: { href: 'https://shawnos.ai/how-to', label: 'all guides' },
          },
        }}
      />
    </>
  )
}
