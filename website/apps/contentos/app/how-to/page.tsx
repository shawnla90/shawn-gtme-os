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
  title: 'How to Build an AI Assistant | AI Content Stack Guides',
  description:
    'Step-by-step guides for how to build an AI assistant and content operating system. MCP content stacks, publishing workflows, voice systems, and tools that compound.',
  keywords: [
    'how to build AI assistant',
    'how to use AI for content',
    'MCP content stack',
    'AI content workflow',
    'content operating system guides',
    'AI publishing tools',
    'content creation AI tutorial',
  ],
  alternates: { canonical: `${SITE_URL}/how-to` },
  openGraph: {
    title: 'How to Build an AI Assistant | AI Content Stack Guides',
    description:
      'Step-by-step guides for how to build an AI assistant and content operating system. MCP content stacks, publishing workflows, and tools that compound.',
    url: `${SITE_URL}/how-to`,
  },
  twitter: {
    title: 'How to Build an AI Assistant | AI Content Stack Guides',
    description:
      'Step-by-step guides for how to build an AI assistant and content operating system. MCP content stacks, publishing workflows, and tools that compound.',
  },
}

/* ── FAQ schema ───────────────────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do you build an AI assistant for content creation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To build an AI assistant for content creation: (1) Define a voice system in a repo-based markdown file that captures your tone, vocabulary, and anti-patterns. (2) Connect MCP servers for your publishing tools - Typefully for X/LinkedIn, Substack for newsletters. (3) Write skills (prompt templates) that pull from your voice file and push to the right platform. (4) Version-control everything so the assistant learns from every past post. This gives you a persistent AI assistant that sounds like you, not generic AI output.',
      },
    },
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

/* ── HowTo schema ─────────────────────────────────── */

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Build an AI Assistant for Content',
  description:
    'Build a persistent AI assistant that writes in your voice across every platform using a repo-based content operating system.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Define your voice system',
      text: 'Write a core-voice.md file that captures your tone, vocabulary, sentence rhythm, and anti-patterns. This is the DNA your AI assistant pulls from on every generation.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Connect MCP servers to your publishing tools',
      text: 'Set up MCP servers for Typefully (X/LinkedIn), Substack, and any audio or image tools. Each server gives your AI agent direct access to publish without copy-pasting.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Write platform skills (prompt templates)',
      text: 'Create markdown skill files for each platform - one for X threads, one for LinkedIn posts, one for newsletters. Each skill references your voice file and enforces platform-specific rules.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Version-control everything',
      text: 'Keep all drafts, finals, voice files, and skill files in a git repo. This gives your AI assistant long-term memory and lets you audit every output.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Run recursive content loops',
      text: 'Set up cron jobs or manual triggers that repurpose high-performing posts across platforms. One blog post becomes five LinkedIn posts, three X threads, and a newsletter.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <HowToWikiPage entries={entries} categories={categories} />
    </>
  )
}
