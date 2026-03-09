import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CopyButton, CodeBlock } from './components'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PageHero, ScrollRevealSection, SectionHeadline } from './ApiHero'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('API')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
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
      title: t('metadata.title'),
      description: t('metadata.description'),
      url: 'https://shawnos.ai/api',
      siteName: 'ShawnOS.ai',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadata.title'),
      description: t('metadata.description'),
    },
  }
}

export default async function APIPage() {
  const t = await getTranslations('API')
  return (
    <>
    <BreadcrumbSchema items={[{ name: 'API', url: 'https://shawnos.ai/api' }]} />
    <PageHero
      compact
      title={t('heroTitle')}
      subtitle={t('heroSubtitle')}
    />
    <div className="min-h-0 text-gray-100" style={{ background: 'var(--canvas)' }}>
      {/* Quick example */}
      <ScrollRevealSection background="var(--canvas)">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-sm text-gray-500">
              GET /api/status
            </span>
            <CopyButton
              text="curl https://shawnos.ai/api/status"
              label={t('copyButton')}
            />
          </div>
          <pre className="overflow-x-auto font-mono text-sm text-green-400">
            <code>curl https://shawnos.ai/api/status</code>
          </pre>
        </div>
      </ScrollRevealSection>

      {/* Quick Start */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div>
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            {t('sections.quickStart')}
          </h2>

          <div className="space-y-6">
            {/* cURL */}
            <div>
              <h3 className="mb-3 font-mono text-lg text-gray-300">{t('quickStart.curl')}</h3>
              <CodeBlock
                language="bash"
                code={`curl https://shawnos.ai/api/status`}
              />
            </div>

            {/* JavaScript/Fetch */}
            <div>
              <h3 className="mb-3 font-mono text-lg text-gray-300">
                {t('quickStart.jsFetch')}
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
              <h3 className="mb-3 font-mono text-lg text-gray-300">{t('quickStart.python')}</h3>
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
      </ScrollRevealSection>

      {/* Response Schema */}
      <ScrollRevealSection background="var(--canvas)">
        <div>
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            {t('sections.responseSchema')}
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
      </ScrollRevealSection>

      {/* Use Cases */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div>
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            {t('sections.useCases')}
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <UseCase
              title={t('useCases.embedStats.title')}
              description={t('useCases.embedStats.description')}
              icon="📊"
            />
            <UseCase
              title={t('useCases.discordBot.title')}
              description={t('useCases.discordBot.description')}
              icon="🤖"
            />
            <UseCase
              title={t('useCases.twitterAutomation.title')}
              description={t('useCases.twitterAutomation.description')}
              icon="🐦"
            />
            <UseCase
              title={t('useCases.studyArchitecture.title')}
              description={t('useCases.studyArchitecture.description')}
              icon="🔬"
            />
          </div>
        </div>
      </ScrollRevealSection>

      {/* How This System Works */}
      <ScrollRevealSection background="var(--canvas)">
        <div>
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            {t('sections.howItWorks')}
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
      </ScrollRevealSection>

      {/* Build Your Own */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div>
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            {t('sections.buildYourOwn')}
          </h2>

          <p className="mb-6 text-gray-300">
            Want to build a similar system? Here's the architecture:
          </p>

          <div className="space-y-6">
            <ArchitectureComponent
              title={t('buildYourOwn.steps.dataPipeline.title')}
              description={t('buildYourOwn.steps.dataPipeline.description')}
            />
            <ArchitectureComponent
              title={t('buildYourOwn.steps.persistenceLayer.title')}
              description={t('buildYourOwn.steps.persistenceLayer.description')}
            />
            <ArchitectureComponent
              title={t('buildYourOwn.steps.apiEndpoint.title')}
              description={t('buildYourOwn.steps.apiEndpoint.description')}
            />
            <ArchitectureComponent
              title={t('buildYourOwn.steps.frontendDisplay.title')}
              description={t('buildYourOwn.steps.frontendDisplay.description')}
            />
          </div>

          <div className="mt-8 rounded-lg border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="mb-3 font-mono text-lg text-green-400">
              {t('buildYourOwn.toolStack')}
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
      </ScrollRevealSection>

      {/* About ShawnOS */}
      <ScrollRevealSection background="var(--canvas)">
        <div>
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            {t('sections.aboutShawnOS')}
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
      </ScrollRevealSection>

      {/* Related Resources */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <div>
          <h2 className="mb-6 font-mono text-2xl font-bold text-green-400">
            {t('sections.relatedResources')}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <ResourceLink
              href="/"
              title={t('resources.homepage.title')}
              description={t('resources.homepage.description')}
            />
            <ResourceLink
              href="https://github.com/shawnla90/shawn-gtme-os"
              title={t('resources.github.title')}
              description={t('resources.github.description')}
              external
            />
            <ResourceLink
              href="https://github.com/shawnla90/shawn-gtme-os/blob/main/README.md"
              title="README"
              description="Project overview and setup instructions"
              external
            />
            <ResourceLink
              href="/rpg-preview"
              title={t('resources.rpgEngine.title')}
              description={t('resources.rpgEngine.description')}
            />
          </div>
        </div>
      </ScrollRevealSection>
    </div>
    </>
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
