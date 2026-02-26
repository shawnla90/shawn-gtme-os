import type { Metadata } from 'next'
import {
  HOW_TO_WIKI_ENTRIES,
  HOW_TO_WIKI_CATEGORIES,
} from '@shawnos/shared/data/how-to-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { HowToWikiPage } from '@shawnos/shared/pages/HowToWikiPage'
import type { HowToWikiPageConfig } from '@shawnos/shared/pages/HowToWikiPage'

const SITE_URL = 'https://shawnos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'How-To Wiki | The Practitioner\'s Guide to AI Tools',
  description:
    'Step-by-step guides for Cursor IDE, Claude Code, MCP servers, parallel agents, cost management, and AI security. Written by a practitioner who builds with these tools every day.',
  keywords: [
    'how to use cursor IDE',
    'claude code tutorial',
    'how to use MCP servers',
    'AI IDE setup guide',
    'claude code vs cursor',
    'parallel AI agents',
    'AI coding cost management',
    'AI security guide',
    'cursor IDE guide',
    'claude code setup',
  ],
  alternates: { canonical: `${SITE_URL}/how-to` },
  openGraph: {
    title: 'How-To Wiki | The Practitioner\'s Guide to AI Tools',
    description:
      'Step-by-step guides for Cursor IDE, Claude Code, MCP servers, parallel agents, and AI security from a practitioner who builds with these tools daily.',
    url: `${SITE_URL}/how-to`,
    images: [
      {
        url: `/og?title=${encodeURIComponent('How-To Wiki')}&subtitle=${encodeURIComponent("The Practitioner's Guide")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'How-To Wiki | The Practitioner\'s Guide to AI Tools',
    description:
      'Step-by-step guides for Cursor IDE, Claude Code, MCP servers, parallel agents, and AI security from a practitioner who builds with these tools daily.',
    images: [
      `/og?title=${encodeURIComponent('How-To Wiki')}&subtitle=${encodeURIComponent("The Practitioner's Guide")}`,
    ],
  },
}

/* ── FAQ schema for hub page ──────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I get started with Cursor IDE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Download Cursor from cursor.com, open a project folder, and use Cmd+L (Mac) or Ctrl+L (Windows) to open the AI chat panel. Describe what you want to build and the agent reads your codebase and writes code for you. Configure rules, skills, and context files to make the AI work like a teammate who has read all your docs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Claude Code and how do I use it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Claude Code is a terminal-based AI agent from Anthropic. Install it with npm install -g @anthropic-ai/claude-code, navigate to any project folder, and type claude to start a session. It reads your entire repo and can create files, run commands, and build features from natural language descriptions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are MCP servers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Model Context Protocol (MCP) servers are bridges between your AI agent and external tools like Slack, HeyReach, Substack, and Vercel. Each server connects to one tool and gives the agent actions it can take — reading channels, exporting leads, creating drafts, deploying sites — all without leaving your IDE.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do parallel AI agents work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Parallel agents means running multiple AI agents simultaneously on independent tasks. Identify tasks that do not write to the same files or depend on each other\'s output, group them into waves, and launch them concurrently. A 45-minute sequential build can finish in under 10 minutes with proper parallel execution.',
      },
    },
  ],
}

/* ── page config ──────────────────────────────────── */

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

const config: HowToWikiPageConfig = {
  siteName: 'shawnos',
  siteUrl: SITE_URL,
  title: 'How-To Wiki',
  description:
    'The practitioner\'s guide to AI tools. Not the docs — the step-by-step walkthroughs, real configurations, and hard-won patterns from building an entire operating system with AI IDEs, CLI agents, and MCP servers.',
  terminalCommand: 'cd ~/how-to',
  badge: 'AI Engineering Practitioner',
  entries,
  categories,
  navLinks: {
    left: { href: '/knowledge', label: 'knowledge guide' },
    right: { href: '/clay-wiki', label: 'clay wiki' },
  },
}

/* ── page component ───────────────────────────────── */

export default function HowToPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Knowledge', url: `${SITE_URL}/knowledge` },
          { name: 'How-To Wiki', url: `${SITE_URL}/how-to` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HowToWikiPage config={config} />
    </>
  )
}
