import type { Metadata } from 'next'
import { hreflang } from '../../../i18n/hreflang'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import {
  getLocalizedHowToEntries,
  getLocalizedHowToCategories,
} from '@shawnos/shared/data/how-to-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { HowToWikiPage } from '@shawnos/shared/pages/HowToWikiPage'
import type { HowToWikiPageConfig } from '@shawnos/shared/pages/HowToWikiPage'

const SITE_URL = 'https://shawnos.ai'

/* ── metadata ─────────────────────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('HowTo')
  return {
    title: 'How to Run AI Locally on Windows & Use AI in DevOps | AI Agent Orchestration, Setup & Automation - Build a Personal AI Assistant - ShawnOS',
    description: 'Step-by-step guides to using AI in DevOps — how to run AI locally on Windows, set up offline AI tools, and build privacy-first AI assistants that run on your own hardware. Learn how to orchestrate AI agents, select the right AI agent orchestration tools, and build setup workflows and automation pipelines. No paid tools required. Covers Claude Code, MCP servers, parallel agents, and AI automation pipelines.',
    keywords: [
      'how to use AI in DevOps',
      'AI in DevOps',
      'automate DevOps workflows with AI',
      'AI DevOps tools',
      'free AI agents',
      'free AI automations',
      'ai agent automation',
      'ai agent orchestration tools',
      'AI agent orchestration',
      'how to orchestrate AI agents',
      'AI agent setup',
      'how to set up AI agents',
      'AI agent workflow automation',
      'automate with AI agents',
      'AI agent setup guide',
      'AI agent memory system setup',
      'how to set up an AI agent memory system',
      'build AI agents free',
      'free automation tools',
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
      'claude opus vs sonnet vs haiku',
      'which claude model should I use',
      'claude model comparison',
      'claude opus vs sonnet',
      'claude sonnet vs haiku',
      'best claude model for coding',
      'claude model speed cost capability',
      'how to run AI locally on Windows',
      'run AI locally on Windows',
      'local AI setup Windows',
      'offline AI tools Windows',
      'privacy-first AI assistant',
      'run AI offline',
      'local AI models Windows',
    ],
    alternates: { canonical: `${SITE_URL}/how-to`, languages: hreflang('/how-to') },
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
    {
      '@type': 'Question',
      name: 'Which Claude model should you use - Opus, Sonnet, or Haiku?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Claude Opus is the most capable model - best for complex reasoning, multi-step agent tasks, and code generation where quality matters more than cost. Claude Sonnet is the sweet spot for most daily use: fast, capable, and roughly 5x cheaper than Opus. Claude Haiku is the fastest and cheapest - ideal for high-frequency tasks like classification, summarization, or any place you need sub-second responses at scale. For Claude Code sessions, Sonnet handles 90% of tasks; reach for Opus when the problem is genuinely hard.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Claude Opus and Claude Sonnet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Claude Opus is Anthropic\'s highest-capability model with the strongest reasoning and instruction-following, at roughly 5x the cost of Sonnet per token. Claude Sonnet delivers near-Opus quality at a fraction of the cost with faster response times. For most coding, writing, and agent tasks, Sonnet is the better default. Use Opus when you need maximum accuracy on hard problems or when cost is not a constraint.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best way to run AI locally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best way to run AI locally depends on your workflow. Ollama is the most practical starting point — it runs in the terminal, supports models like Llama, Mistral, and Qwen, requires no account, and works entirely offline. Install it with one command, pull a model (e.g. ollama pull llama3), and start querying immediately. For a GUI experience, LM Studio lets you browse, download, and test models without touching a terminal. Both are free. If you want local AI integrated with a coding environment, Ollama can be connected to Claude Code or Cursor as a local model provider.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I run an AI assistant locally for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Ollama and LM Studio are both free and open source. They run models like Llama 3, Mistral, Phi-3, and Qwen entirely on your machine with no API keys, no subscriptions, and no data leaving your hardware. For a 7B model, 8 GB of RAM is enough to get usable responses. 16 GB handles 13B models comfortably. A GPU speeds things up significantly but is not required — CPU-only works on all modern machines.',
      },
    },
    {
      '@type': 'Question',
      name: 'What hardware do I need to run AI locally?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Minimum hardware to run AI locally: 8 GB RAM runs 7B parameter models at usable speed. 16 GB RAM handles 13B models comfortably. 32 GB or more lets you run 30B+ models locally. A GPU with 8 GB+ VRAM dramatically improves inference speed, but CPU-only works on any modern machine — it is just slower. On Windows, both Ollama and LM Studio support GPU acceleration via CUDA (Nvidia) or Vulkan. For most users starting out, an 8 GB RAM machine with Ollama and a 7B model is enough to evaluate whether local AI fits your workflow.',
      },
    },
  ],
}

/* ── page component ───────────────────────────────── */

export default async function HowToPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('HowTo')

  const localizedEntries = getLocalizedHowToEntries(locale)
  const localizedCategories = getLocalizedHowToCategories(locale)

  const entries = [
    ...localizedEntries.filter((e) => e.id !== 'how-to-build-persistent-ai-memory').map((e) => ({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle,
      category: e.category,
      difficulty: e.difficulty,
      // Every guide is served locally now — the sibling sites are gone.
      canonicalSite: 'shawnos' as const,
    })),
    {
      id: 'how-to-build-persistent-ai-memory',
      title: 'How to set up an AI agent memory system',
      subtitle: 'Session handoffs, memory files, and the architecture that makes AI remember',
      category: 'cli-tools' as const,
      difficulty: 'intermediate' as const,
      canonicalSite: 'shawnos' as const,
    },
  ]

  const categories = localizedCategories.map((c) => ({
    id: c.id,
    label: c.label,
    description: c.description,
    prompt: c.prompt,
  }))

  const config: HowToWikiPageConfig = {
    siteName: 'shawnos',
    siteUrl: SITE_URL,
    title: t('hubPage.title'),
    description:
      t('hubPage.description'),
    terminalCommand: 'cd ~/how-to',
    badge: t('hubPage.badge'),
    intro: 'People are one prompt away from spinning up an AI agent but three years away from having a personal AI assistant that actually knows their business. The gap is AI infrastructure. These guides cover how to build that foundation from scratch: agent memory systems, MCP server connections, parallel agent pipelines, and security patterns that work without paid tools. Every guide is a working playbook from real builds — specific steps, real edge cases, no theory. Build your own AI content pipeline or automation stack and own it completely.',
    entries,
    categories,
    navLinks: {
      left: { href: '/knowledge', label: t('hubPage.nav.left') },
      right: { href: '/clay-wiki', label: t('hubPage.nav.right') },
    },
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: t('breadcrumb.knowledge'), url: `${SITE_URL}/knowledge` },
          { name: t('breadcrumb.howToWiki'), url: `${SITE_URL}/how-to` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h1 className="sr-only">How to Build Your Own AI: AI Agent Setup, Agent Automation and Build a Personal AI Assistant</h1>
      <p className="max-w-3xl mx-auto px-6 pt-8 pb-0 text-white/60 text-sm leading-relaxed">
        If you want to build your own AI — a personal AI assistant that knows your business or create your own AI tools that run on your infrastructure — you need more than prompts. You need the infrastructure layer: agent memory systems, MCP server connections, and automation pipelines that hold context across sessions. These guides cover how to build that foundation from real builds, with specific steps and working code.
      </p>
      <div className="max-w-3xl mx-auto px-6 pt-6 pb-0">
        <div className="border border-white/20 rounded-lg p-5 bg-white/[0.03]">
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Featured Topic</span>
          <h2 className="text-base font-semibold text-white mt-2 mb-2">Running AI Locally on Windows</h2>
          <p className="text-sm text-white/60 mb-4">
            You do not need cloud subscriptions to run capable AI models on your own hardware. Two tools make local AI accessible on Windows: <span className="text-white">Ollama</span> (terminal-first runner, supports Llama, Mistral, Qwen, and dozens more — free, no account required) and <span className="text-white">LM Studio</span> (GUI-based, good for exploring and testing models without touching a terminal). Both are free to download and run entirely offline.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Recommended tools</h3>
              <ul className="text-sm text-white/60 space-y-1">
                <li><span className="text-white">Ollama</span> — terminal-first, scriptable, Claude Code-compatible</li>
                <li><span className="text-white">LM Studio</span> — GUI interface, good for first-timers</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Minimum hardware</h3>
              <ul className="text-sm text-white/60 space-y-1">
                <li>8 GB RAM — runs 7B models at usable speed</li>
                <li>16 GB RAM — comfortable for 13B models</li>
                <li>GPU optional — CPU-only works, just slower</li>
              </ul>
            </div>
          </div>
          <a
            href="/how-to/claude-code-quickstart"
            className="inline-flex items-center gap-1 text-sm text-white underline underline-offset-2 hover:text-white/80"
          >
            Start here: Claude Code Quickstart guide →
          </a>
        </div>
      </div>
      <HowToWikiPage config={config} />
      <section className="max-w-3xl mx-auto px-6 py-10 border-t border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Which Claude model should you use?</h2>
        <p className="text-sm text-white/60 mb-6">
          If you are building with Claude Code or wiring up Claude to an agent pipeline, you will hit this question fast: Opus, Sonnet, or Haiku? Here is the short version.
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 pr-4 text-white/40 font-normal">Model</th>
                <th className="text-left py-2 pr-4 text-white/40 font-normal">Speed</th>
                <th className="text-left py-2 pr-4 text-white/40 font-normal">Relative cost</th>
                <th className="text-left py-2 text-white/40 font-normal">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-4 text-white font-medium">Claude Opus</td>
                <td className="py-2 pr-4 text-white/60">Slower</td>
                <td className="py-2 pr-4 text-white/60">$$$</td>
                <td className="py-2 text-white/60">Complex reasoning, hard coding problems, multi-step agents where quality is critical</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-4 text-white font-medium">Claude Sonnet</td>
                <td className="py-2 pr-4 text-white/60">Fast</td>
                <td className="py-2 pr-4 text-white/60">$$</td>
                <td className="py-2 text-white/60">Daily coding, writing, agent tasks — near-Opus quality at ~5x lower cost. Default for most use cases</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-white font-medium">Claude Haiku</td>
                <td className="py-2 pr-4 text-white/60">Fastest</td>
                <td className="py-2 pr-4 text-white/60">$</td>
                <td className="py-2 text-white/60">High-frequency tasks: classification, summarization, routing — anywhere you need scale or sub-second response</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-base font-semibold text-white mb-3">Claude Opus vs Sonnet vs Haiku: when each makes sense</h3>
        <div className="space-y-3 text-sm text-white/60">
          <p>
            <span className="text-white">Opus</span> is the right call when you are stuck on something genuinely hard — a complex refactor, a multi-file architectural change, or an agent that needs to reason through ambiguity without hand-holding. The quality jump is real. The cost jump is also real.
          </p>
          <p>
            <span className="text-white">Sonnet</span> handles 90% of what most builders do day-to-day. In Claude Code sessions it is the default for good reason — fast enough to feel responsive, capable enough to write production code without constant corrections.
          </p>
          <p>
            <span className="text-white">Haiku</span> is what you reach for when you are running something thousands of times: a nightly cron that classifies leads, a pipeline that routes content, a webhook handler that needs to reply in under a second. Not built for depth — built for throughput.
          </p>
          <p>
            The practical rule: start with Sonnet. Upgrade to Opus only when Sonnet gets it wrong twice on the same problem. Use Haiku for anything you would not want to pay Sonnet prices to run at scale.
          </p>
        </div>
      </section>
      <section className="max-w-3xl mx-auto px-6 py-10 border-t border-white/10">
        <h2 className="text-lg font-semibold text-white mb-2">Related guides</h2>
        <p className="text-sm text-white/60 mb-3">
          Want to go deeper? See how to{' '}
          <a
            href="/log/build-your-own"
            className="text-white underline underline-offset-2 hover:text-white/80"
          >
            build your own AI companion free
          </a>{' '}
          — a step-by-step log of setting up a personal AI assistant with no paid subscriptions.
        </p>
      </section>
    </>
  )
}
