import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import {
  HOW_TO_WIKI_ENTRIES,
  HOW_TO_WIKI_CATEGORIES,
} from '@shawnos/shared/data/how-to-wiki'
import { HowToWikiPage } from '@shawnos/shared/pages/HowToWikiPage'
import type { HowToWikiPageConfig } from '@shawnos/shared/pages/HowToWikiPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { SITES } from '@shawnos/shared/lib/sites'

const SITE_URL = SITES.contentos

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'How to Build an AI Agent with Claude Code | ContentOS',
  description:
    'How to build an AI agent with Claude Code — step-by-step guides covering Claude Code agent setup, memory systems, MCP integrations, voice systems, and full content OS architecture that runs without a paid API.',
  keywords: [
    'build ai agent with claude code',
    'how to build an AI agent with Claude Code',
    'claude code agent setup',
    'how to build AI assistant',
    'how to build a personal AI assistant with memory',
    'best ai agent orchestration',
    'AI agent memory system setup',
    'how to set up an AI agent memory system',
    'how to use AI for content',
    'MCP content stack',
    'AI content workflow',
    'content operating system guides',
    'AI publishing tools',
    'content creation AI tutorial',
    'ai agent automation tools',
    'free ai agent automation tool',
    'free ai agent setup',
  ],
  alternates: { canonical: `${SITE_URL}/how-to` },
  openGraph: {
    type: 'website',
    title: 'How to Build an AI Assistant | AI Agent Memory System Setup & Orchestration Guides',
    description:
      'Step-by-step guides for how to build a personal AI assistant with memory using the best AI agent orchestration patterns. Covers AI agent memory system setup, MCP content stacks, publishing workflows, and tools that compound.',
    url: `${SITE_URL}/how-to`,
  },
  twitter: {
    title: 'How to Build an AI Assistant | AI Agent Memory System Setup & Orchestration Guides',
    description:
      'Step-by-step guides for how to build a personal AI assistant with memory using the best AI agent orchestration patterns. Covers AI agent memory system setup, MCP content stacks, publishing workflows, and tools that compound.',
  },
}

/* ── FAQ schema ───────────────────────────────────── */

const faqItems: { question: string; answer: string; answerNode?: ReactNode }[] = [
  {
    question: 'What is AI agent orchestration?',
    answer:
      'AI agent orchestration is the practice of coordinating multiple AI agents - each with a specific role - so they hand work off to each other without human intervention between steps. Instead of one prompt doing everything, you break a workflow into discrete agents: a research agent that pulls data, a writing agent that drafts from that data, and a publishing agent that pushes the output to the right platform. The orchestrator decides which agent runs next based on the output of the previous one. The result is a reliable, repeatable pipeline instead of a one-shot prompt you re-run manually every time.',
  },
  {
    question: 'How do you set up an AI agent workflow?',
    answer:
      'To set up an AI agent workflow: (1) Map the stages of your task - research, draft, review, publish - and assign one agent responsibility per stage. (2) Define each agent\'s inputs and outputs so the handoff is clean; agents should not need to guess what the previous step produced. (3) Connect external tools via MCP servers so agents can read from and write to real systems like Notion, Typefully, or a database. (4) Write a skill file (prompt template) for each agent that encodes the rules for that stage. (5) Wire the stages together with an orchestrator script that runs each agent in sequence and passes outputs forward. Start with two agents and a single handoff before scaling to five.',
  },
  {
    question: 'What tools are used for AI agent orchestration?',
    answer:
      'The most common tools for AI agent orchestration: Claude Code or Cursor as the dev environment where agents run; MCP (Model Context Protocol) servers to bridge agents to external tools like Typefully, Substack, Notion, and Slack; a git repo to version-control every agent definition and skill file; a SQLite or Postgres database to store agent state and memory between runs; and launchd or cron to schedule recurring pipelines. At the framework level, Claude\'s built-in tool-use and multi-turn context handle most orchestration needs without requiring a heavy external framework like LangChain.',
  },
  {
    question: 'What is the best AI agent orchestration pattern for content creation?',
    answer:
      'The most reliable pattern for content creation is a sequential pipeline with a shared voice file. One agent researches a topic or pulls from a keyword brief. A second agent drafts the content by reading the research output and your voice system markdown. A third agent runs an anti-slop scan against the draft. A fourth agent pushes the approved output to the target platform via MCP. Each agent is stateless - it reads its input, does one job, and writes its output. The voice file is the shared constant all agents reference, which is what keeps tone consistent across hundreds of automated posts.',
  },
  {
    question: 'How does AI agent orchestration differ from a single AI prompt?',
    answer:
      'A single prompt asks one model to do everything in one shot - research, draft, format, and finalize. It works for simple tasks but degrades fast as complexity grows because the model has to balance too many constraints at once. Agent orchestration splits those constraints across specialized agents: each agent is small, focused, and evaluated independently. You can swap out one agent without touching the rest. You can rerun a failed stage without repeating the whole pipeline. And you can log the output of each stage, which makes debugging a bad result much faster than re-reading a 3,000-token prompt to figure out where it went wrong.',
  },
  {
    question: 'How do I build my own AI assistant?',
    answer:
      'Start by writing a voice file - a markdown document that captures your tone, vocabulary, and the patterns you want the AI to follow consistently. Then connect it to your publishing tools via MCP servers so it can write and post without copy-pasting. The full setup walkthrough is in the guide on AI agent memory system setup.',
    answerNode: (
      <>
        Start by writing a voice file - a markdown document that captures your tone, vocabulary, and the patterns you want the AI to follow consistently. Then connect it to your publishing tools via MCP servers so it can write and post without copy-pasting. The full setup walkthrough is in the{' '}
        <a href="/how-to/how-to-build-persistent-ai-memory" style={{ textDecoration: 'underline' }}>
          guide on AI agent memory system setup
        </a>
        .
      </>
    ),
  },
  {
    question: 'What is a personal AI assistant kit?',
    answer:
      'A personal AI assistant kit is the set of files, configs, and integrations that make an AI work specifically for you: a voice file, skill files (prompt templates per task), MCP server connections, and a git repo that gives it long-term memory. Unlike a generic chatbot, a kit is opinionated - it knows your workflow, your tone, and where to put output. You can see what a real kit looks like in the build your own log.',
    answerNode: (
      <>
        A personal AI assistant kit is the set of files, configs, and integrations that make an AI work specifically for you: a voice file, skill files (prompt templates per task), MCP server connections, and a git repo that gives it long-term memory. Unlike a generic chatbot, a kit is opinionated - it knows your workflow, your tone, and where to put output. You can see what a real kit looks like in the{' '}
        <a href="/log/build-your-own" style={{ textDecoration: 'underline' }}>
          build your own log
        </a>
        .
      </>
    ),
  },
  {
    question: 'Can I build an airplane kit workflow with AI?',
    answer:
      'Yes - the airplane kit model applies directly to AI-assisted builds: every step is predefined, parts are standardized, and you assemble rather than fabricate from scratch. With AI, you replace manual fabrication with skill files (reusable prompt templates) and MCP tools that handle the mechanical steps automatically. The build your own log documents exactly how this plays out in a real content OS build.',
    answerNode: (
      <>
        Yes - the airplane kit model applies directly to AI-assisted builds: every step is predefined, parts are standardized, and you assemble rather than fabricate from scratch. With AI, you replace manual fabrication with skill files (reusable prompt templates) and MCP tools that handle the mechanical steps automatically. The{' '}
        <a href="/log/build-your-own" style={{ textDecoration: 'underline' }}>
          build your own log
        </a>{' '}
        documents exactly how this plays out in a real content OS build.
      </>
    ),
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

/* ── HowTo schema ─────────────────────────────────── */

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Build an AI Agent Memory System for Content',
  description:
    'Build a persistent AI agent memory system and complete agent setup that writes in your voice across every platform using a repo-based content operating system.',
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

const config: HowToWikiPageConfig = {
  siteName: 'contentos',
  siteUrl: SITE_URL,
  title: 'How-To: AI Agent Setup & Content Stack',
  description:
    'Step-by-step guides for AI agent setup, building an AI agent memory system, and running a full content operating system. MCP integrations, publishing workflows, voice systems, and tools that compound.',
  terminalCommand: 'cd ~/how-to --site=contentos',
  badge: 'AI Agent Guides',
  intro:
    'Most people are still prompting one tool at a time. These guides show you how to build an AI agent with Claude Code - from initial setup to a full content OS that runs without you. When you build an AI agent with Claude Code, your agent knows your voice, remembers decisions, and ships content across platforms while you focus on strategy. Covers Claude Code agent setup, AI infrastructure design, MCP integrations, agent memory systems, voice files, and the repo structure that makes everything compound. Whether you are starting from zero or converting an existing workflow - each guide is written for practitioners who want something that actually runs, not a five-minute demo that breaks in production.',
  entries: [
    ...HOW_TO_WIKI_ENTRIES.filter((e) => e.id !== 'how-to-build-persistent-ai-memory').map((e) => ({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle,
      category: e.category,
      difficulty: e.difficulty,
      canonicalSite: e.canonicalSite,
    })),
    {
      id: 'how-to-build-persistent-ai-memory',
      title: 'How to set up an AI agent memory system',
      subtitle: 'Session handoffs, memory files, and the architecture that makes AI remember',
      category: 'cli-tools' as const,
      difficulty: 'intermediate' as const,
      canonicalSite: 'shawnos' as const,
    },
  ],
  categories: HOW_TO_WIKI_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    prompt: c.prompt,
  })),
  navLinks: {
    left: { href: '/', label: 'home' },
    right: { href: '/content-wiki', label: 'content wiki' },
  },
}

export default function ContentOSHowToPage() {
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
      <h1
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '32px 24px 0',
          fontSize: '1.5rem',
          fontWeight: 700,
          lineHeight: '1.4',
        }}
      >
        How to build an AI agent with Claude Code — personal AI assistant setup, Claude Code agent configuration, and the content OS stack that runs without you.
      </h1>
      <p
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '16px 24px 0',
          lineHeight: '1.7',
          fontSize: '1rem',
        }}
      >
        These guides are built for the AI assistant for solopreneurs - solo operators running their own content stack without a team behind them. If you are the writer, the publisher, the strategist, and the editor all at once, this is your playbook. Each guide is written for practitioners who want a system that actually runs, not a demo that breaks after one use.
      </p>
      <HowToWikiPage config={config} />
      <section
        aria-label="Frequently asked questions about AI agent orchestration"
        style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '32px' }}>
          FAQ: AI Agent Setup & Orchestration
        </h2>
        {faqItems.map((item) => (
          <div
            key={item.question}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            style={{ marginBottom: '32px' }}
          >
            <h3
              itemProp="name"
              style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}
            >
              {item.question}
            </h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p itemProp="text" style={{ lineHeight: '1.7', margin: 0 }}>
                {item.answerNode ?? item.answer}
              </p>
            </div>
          </div>
        ))}
      </section>
    </>
  )
}
