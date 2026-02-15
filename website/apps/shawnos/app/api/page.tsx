import type { Metadata } from 'next'
import { CopyButton, CodeBlock } from './components'

export const metadata: Metadata = {
  title: 'Public API | ShawnOS.ai — Real-Time RPG Progression Feed',
  description:
    'Access my live XP, level, and milestones via JSON. A public API for tracking real-time progress on GTM engineering and content shipped in public. Built with Claude Code, Cursor, and MCP servers.',
  keywords: [
    'personal dashboard API',
    'RPG progression system',
    'developer status feed',
    'real-time progress tracking',
    'JSON API',
    'API documentation',
    'gamification system',
    'developer dashboard',
    'MCP servers',
    'Claude Code',
    'Cursor IDE',
    'vibe coding',
    'GTM engineering',
    'build in public API',
    'content operating system',
    'Next.js API',
    'TypeScript API',
  ],
  alternates: {
    canonical: 'https://shawnos.ai/api',
  },
  openGraph: {
    title: 'Public API | ShawnOS.ai — Real-Time RPG Progression Feed',
    description:
      'Access my live XP, level, and milestones via JSON. Track real-time progress on GTM engineering and content.',
    url: 'https://shawnos.ai/api',
    siteName: 'ShawnOS.ai',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Public API | ShawnOS.ai',
    description:
      'Access my live XP, level, and milestones via JSON. Real-time RPG progression feed.',
  },
}

export default function APIPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Hero Section */}
      <section className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-6 inline-block rounded border border-green-500/30 bg-green-500/10 px-3 py-1 font-mono text-xs text-green-400">
            API v1.0
          </div>
          <h1 className="mb-4 font-mono text-4xl font-bold text-green-400 md:text-5xl">
            Public API
          </h1>
          <p className="mb-8 text-xl text-gray-300">
            Real-Time Progression Feed
          </p>
          <p className="mb-8 max-w-2xl text-lg text-gray-400">
            Track my live XP, level, and milestones via JSON. This public API
            exposes real-time stats from the ShawnOS RPG progression system.
          </p>

          {/* Quick example */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-sm text-gray-500">
                GET /api/status
              </span>
              <CopyButton
                text="curl https://shawnos.ai/api/status"
                label="Copy"
              />
            </div>
            <pre className="overflow-x-auto font-mono text-sm text-green-400">
              <code>curl https://shawnos.ai/api/status</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="border-b border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            Quick Start
          </h2>

          <div className="space-y-6">
            {/* cURL */}
            <div>
              <h3 className="mb-3 font-mono text-lg text-gray-300">cURL</h3>
              <CodeBlock
                language="bash"
                code={`curl https://shawnos.ai/api/status`}
              />
            </div>

            {/* JavaScript/Fetch */}
            <div>
              <h3 className="mb-3 font-mono text-lg text-gray-300">
                JavaScript (fetch)
              </h3>
              <CodeBlock
                language="javascript"
                code={`fetch('https://shawnos.ai/api/status')
  .then(res => res.json())
  .then(data => {
    console.log(\`Level \${data.level}: \${data.title}\`)
    console.log(\`XP: \${data.xp_total} / \${data.xp_next_level}\`)
  })`}
              />
            </div>

            {/* Python */}
            <div>
              <h3 className="mb-3 font-mono text-lg text-gray-300">Python</h3>
              <CodeBlock
                language="python"
                code={`import requests

response = requests.get('https://shawnos.ai/api/status')
data = response.json()

print(f"Level {data['level']}: {data['title']}")
print(f"XP: {data['xp_total']} / {data['xp_next_level']}")`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Response Schema */}
      <section className="border-b border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            Response Schema
          </h2>

          <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <CodeBlock
              language="json"
              code={`{
  "name": "Operator",
  "title": "Prompt Apprentice",
  "level": 9,
  "xp_total": 1882,
  "xp_next_level": 2000,
  "class": "Polymath",
  "avatar_tier": 1,
  "milestones": [
    {
      "id": "first_100xp",
      "title": "Spark Plug",
      "description": "Earned 100 XP",
      "unlocked_at": "2026-02-15T05:51:44Z"
    }
  ],
  "updated_at": "2026-02-15T05:51:44Z",
  "meta": {
    "api_version": "1.0",
    "docs": "https://shawnos.ai/api"
  }
}`}
            />
          </div>

          {/* Field documentation */}
          <div className="space-y-4">
            <FieldDoc
              name="name"
              type="string"
              description="Character display name"
            />
            <FieldDoc
              name="title"
              type="string"
              description="Current RPG title (e.g., 'Terminal Initiate', 'Repo Architect')"
            />
            <FieldDoc
              name="level"
              type="number"
              description="Current level (1-based)"
            />
            <FieldDoc
              name="xp_total"
              type="number"
              description="Total accumulated XP"
            />
            <FieldDoc
              name="xp_next_level"
              type="number"
              description="XP required to reach the next level"
            />
            <FieldDoc
              name="class"
              type="string"
              description="Primary RPG class: Builder, Scribe, Strategist, Alchemist, or Polymath"
            />
            <FieldDoc
              name="avatar_tier"
              type="number"
              description="Avatar visual tier (1-6)"
            />
            <FieldDoc
              name="milestones"
              type="array"
              description="List of unlocked milestone achievements"
            />
            <FieldDoc
              name="updated_at"
              type="string"
              description="ISO-8601 timestamp of last profile update"
            />
            <FieldDoc
              name="meta"
              type="object"
              description="API metadata including version and documentation URL"
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="border-b border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            Use Cases
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <UseCase
              title="Embed Live Stats"
              description="Display real-time XP and level on your portfolio or personal site"
              icon="📊"
            />
            <UseCase
              title="Discord Bot"
              description="Build a bot that tracks progression and announces milestone unlocks"
              icon="🤖"
            />
            <UseCase
              title="Twitter Automation"
              description="Auto-tweet when new milestones are achieved or level-ups occur"
              icon="🐦"
            />
            <UseCase
              title="Study the Architecture"
              description="Examine how a real-time RPG progression system is built and exposed"
              icon="🔬"
            />
          </div>
        </div>
      </section>

      {/* How This System Works */}
      <section className="border-b border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            How This System Works
          </h2>

          <div className="space-y-4 text-gray-300">
            <p>
              The RPG system tracks daily output across multiple dimensions:
              commits, content, GTM deliverables, and more. Each activity type
              contributes to XP based on weighted scoring.
            </p>

            <p>
              Data flows from gitignored Python scripts → public JSON →
              API endpoint. The progression engine scans my work, calculates XP,
              checks for level-ups, and unlocks milestones based on cumulative
              stats.
            </p>

            <p>
              The API endpoint reads from{' '}
              <code className="rounded bg-gray-800 px-2 py-1 font-mono text-sm text-green-400">
                data/progression/profile.json
              </code>{' '}
              (a public file) and serves it with CORS headers and CDN caching.
            </p>

            <p>
              Type definitions are available in the{' '}
              <a
                href="https://github.com/shawnla90/shawn-gtme-os/blob/main/website/packages/shared/lib/rpg.ts"
                className="text-green-400 underline hover:text-green-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                rpg.ts
              </a>{' '}
              file. The core scoring algorithms remain proprietary.
            </p>
          </div>
        </div>
      </section>

      {/* Build Your Own */}
      <section className="border-b border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            Build Your Own
          </h2>

          <p className="mb-6 text-gray-300">
            Want to build a similar system? Here's the architecture:
          </p>

          <div className="space-y-6">
            <ArchitectureComponent
              title="1. Data Pipeline"
              description="Scan your work sources (git, content files, project trackers) and compute scores"
            />
            <ArchitectureComponent
              title="2. Persistence Layer"
              description="Write computed stats to a public JSON file (safe to commit to git)"
            />
            <ArchitectureComponent
              title="3. API Endpoint"
              description="Expose the JSON via a public API with CORS and caching headers"
            />
            <ArchitectureComponent
              title="4. Frontend Display"
              description="Build UI components that fetch and render the progression data"
            />
          </div>

          <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="mb-3 font-mono text-lg text-green-400">
              Tool Stack
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 text-green-400">▸</span>
                <span>
                  <strong className="text-gray-200">Frontend:</strong> Next.js,
                  React, Tailwind CSS
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-400">▸</span>
                <span>
                  <strong className="text-gray-200">Backend:</strong> Python
                  (progression engine), TypeScript (API routes)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-400">▸</span>
                <span>
                  <strong className="text-gray-200">Deployment:</strong> Vercel
                  (auto-deploy from GitHub)
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-400">▸</span>
                <span>
                  <strong className="text-gray-200">Development:</strong> Cursor
                  IDE, Claude Code, MCP servers
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-400">▸</span>
                <span>
                  <strong className="text-gray-200">Monorepo:</strong> Turborepo
                  with shared packages
                </span>
              </li>
            </ul>
          </div>

          <p className="mt-6 text-gray-400">
            I built this using Claude Code and Cursor IDE. The full repo is on{' '}
            <a
              href="https://github.com/shawnla90/shawn-gtme-os"
              className="text-green-400 underline hover:text-green-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>

      {/* About ShawnOS */}
      <section className="border-b border-gray-800 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            About ShawnOS
          </h2>

          <div className="space-y-4 text-gray-300">
            <p>
              This API is part of <strong className="text-gray-200">ShawnOS</strong> — an
              AI-powered operating system for GTM engineering and content
              operations.
            </p>

            <p>
              Built with MCP servers connecting Cursor IDE, Claude Code, and 15+
              automation tools, the system gamifies vibe coding and live
              building in public.
            </p>

            <p>
              Every commit, post, and deliverable feeds the progression engine.
              The RPG system provides real-time feedback and unlocks visual
              rewards as the work compounds.
            </p>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            Related Resources
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <ResourceLink
              href="/"
              title="ShawnOS.ai Homepage"
              description="Main landing page and RPG progression dashboard"
            />
            <ResourceLink
              href="https://github.com/shawnla90/shawn-gtme-os"
              title="GitHub Repository"
              description="Full source code and documentation"
              external
            />
            <ResourceLink
              href="https://github.com/shawnla90/shawn-gtme-os/blob/main/README.md"
              title="README"
              description="Project overview and setup instructions"
              external
            />
            <ResourceLink
              href="/guides"
              title="RPG Progression Guide"
              description="Visual breakdown of titles, tiers, and milestones"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm text-gray-500">
          <p className="mb-2">Built by Shawn Tenam with Claude Code and Cursor IDE</p>
          <p>Deployed on Vercel · Updated in real-time</p>
        </div>
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Component Library                                                */
/* ------------------------------------------------------------------ */

function FieldDoc({
  name,
  type,
  description,
}: {
  name: string
  type: string
  description: string
}) {
  return (
    <div className="rounded border border-gray-800 bg-gray-900/30 p-4">
      <div className="mb-2 flex items-baseline gap-3">
        <code className="font-mono text-green-400">{name}</code>
        <span className="font-mono text-xs text-gray-500">{type}</span>
      </div>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function UseCase({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-6">
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="mb-2 font-mono text-lg text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function ArchitectureComponent({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-5">
      <h3 className="mb-2 font-mono text-base text-green-400">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}

function ResourceLink({
  href,
  title,
  description,
  external,
}: {
  href: string
  title: string
  description: string
  external?: boolean
}) {
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <a
      href={href}
      {...linkProps}
      className="group rounded-lg border border-gray-800 bg-gray-900/30 p-5 transition-all hover:border-green-500/50 hover:bg-gray-900/50"
    >
      <h3 className="mb-2 font-mono text-base text-gray-200 group-hover:text-green-400">
        {title}
        {external && <span className="ml-1 text-xs">↗</span>}
      </h3>
      <p className="text-sm text-gray-400">{description}</p>
    </a>
  )
}
