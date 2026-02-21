import type { Metadata } from 'next'
import {
  HOW_TO_WIKI_ENTRIES,
  HOW_TO_WIKI_CATEGORIES,
} from '@shawnos/shared/data/how-to-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { HowToWikiPage } from '@shawnos/shared/pages/HowToWikiPage'
import type { HowToWikiPageConfig } from '@shawnos/shared/pages/HowToWikiPage'

const SITE_URL = 'https://thegtmos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'How-To Guides | AI-Powered GTM Workflows',
  description:
    'Step-by-step guides for AI-powered go-to-market workflows. MCP servers for outbound, Clay automation, parallel agents, cost management, and security for GTM engineers.',
  keywords: [
    'how to use AI for GTM',
    'MCP servers GTM',
    'AI outbound automation',
    'clay MCP setup',
    'AI GTM workflows',
    'parallel agents GTM',
    'cursor IDE GTM',
    'claude code GTM',
  ],
  alternates: { canonical: `${SITE_URL}/how-to` },
  openGraph: {
    title: 'How-To Guides | AI-Powered GTM Workflows',
    description:
      'Step-by-step guides for AI-powered go-to-market workflows. MCP servers, parallel agents, cost management, and security.',
    url: `${SITE_URL}/how-to`,
  },
  twitter: {
    title: 'How-To Guides | AI-Powered GTM Workflows',
    description:
      'Step-by-step guides for AI-powered go-to-market workflows. MCP servers, parallel agents, cost management, and security.',
  },
}

/* ── FAQ schema ──────────────────────────────────── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I set up MCP servers for GTM workflows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MCP servers connect your AI agent to external tools like Instantly, HeyReach, and Slack. Get an API key from the tool, add a config block to your .cursor/mcp.json, restart the editor, and test by asking Claude to interact with the tool. The GTM stack typically includes email, LinkedIn, Slack, and enrichment MCPs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are parallel agents and how do they speed up GTM work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Parallel agents means running multiple AI agents simultaneously on independent tasks. For GTM, this could mean one agent building campaign copy while another sets up enrichment flows. The key is identifying tasks that do not share file dependencies, then launching them in waves.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I manage AI costs for GTM automation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Match the model to the task. Use fast models for mechanical work like reformatting data or updating configs. Use capable models for creative tasks like writing qualification prompts or architecture decisions. Track usage weekly and adjust model assignment based on output quality.',
      },
    },
  ],
}

/* ── page config ─────────────────────────────────── */

const config: HowToWikiPageConfig = {
  siteName: 'gtmos',
  siteUrl: SITE_URL,
  title: 'How-To: AI-Powered GTM',
  description:
    'Step-by-step guides for building AI-powered go-to-market workflows. From MCP server setup for outbound tools to parallel agent orchestration for campaign builds. GTM-relevant entries featured here, with cross-links to the full engineering library on ShawnOS. Recently updated with advanced OpenClaw + knowledge graph setup covering how we use Nio daily for operations, soul/memory/identity configuration beyond boilerplate methods, and real production use cases like Mission Control integration.',
  terminalCommand: 'cd ~/how-to --site=gtmos',
  badge: 'GTM Engineering Guides',
  entries: HOW_TO_WIKI_ENTRIES.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.subtitle,
    category: e.category,
    difficulty: e.difficulty,
    canonicalSite: e.canonicalSite,
  })),
  categories: HOW_TO_WIKI_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    prompt: c.prompt,
  })),
  statOverride: { label: 'GTM-Native', value: '1' },
  navLinks: {
    left: { href: '/clay-wiki', label: 'clay wiki' },
    right: { href: '/knowledge/gtm', label: 'knowledge guide' },
  },
}

/* ── page component ───────────────────────────────── */

export default function GtmosHowToPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'How-To', url: `${SITE_URL}/how-to` },
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
