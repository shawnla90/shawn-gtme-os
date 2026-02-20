import type { Metadata } from 'next'
import Link from 'next/link'
import path from 'path'
import {
  getAllPosts,
  getAllLogs,
  resolveDataRoot,
  blogPostsToFeedItems,
  dailyLogsToFeedItems,
  howToWikiToFeedItems,
  knowledgeToFeedItems,
  contextWikiToFeedItems,
  clayWikiToFeedItems,
  contentWikiToFeedItems,
  mergeFeedItems,
} from '@shawnos/shared/lib'
import type { FeedItem } from '@shawnos/shared/lib'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { CONTEXT_WIKI_ENTRIES } from '@shawnos/shared/data/context-wiki'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import UpdatesFeed from './UpdatesFeed'
import type { FeedEntry, CategoryFilter } from './UpdatesFeed'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Latest Updates | What\'s New on ShawnOS.ai',
  description:
    'Every new article, wiki entry, feature, and system update on shawnos.ai. Blog posts, context wiki entries, how-to guides, knowledge terms, daily logs, and platform features — all in one feed.',
  keywords: [
    'shawnos updates',
    'shawnos changelog',
    'shawnos new features',
    'gtm engineering updates',
    'ai agent updates',
    'context engineering changelog',
    'shawnos blog',
    'shawnos wiki updates',
    'whats new shawnos',
    'shawnos latest',
  ],
  alternates: {
    canonical: `${SITE_URL}/updates`,
    types: {
      'application/rss+xml': [
        { url: '/feed/updates.xml', title: 'ShawnOS.ai — Latest Updates' },
      ],
    },
  },
  openGraph: {
    title: 'Latest Updates | What\'s New on ShawnOS.ai',
    description:
      'Every new article, wiki entry, feature, and system update. One feed for everything happening on shawnos.ai.',
    url: `${SITE_URL}/updates`,
    images: [
      {
        url: `/og?title=${encodeURIComponent('Latest Updates')}&subtitle=${encodeURIComponent("What's New on ShawnOS.ai")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Latest Updates | What\'s New on ShawnOS.ai',
    description:
      'Every new article, wiki entry, feature, and system update. One feed for everything happening on shawnos.ai.',
    images: [
      `/og?title=${encodeURIComponent('Latest Updates')}&subtitle=${encodeURIComponent("What's New on ShawnOS.ai")}`,
    ],
  },
}

/* ── feature milestones ──────────────────────────── */

interface FeatureMilestone {
  date: string
  title: string
  description: string
  type: 'feature' | 'launch' | 'integration' | 'infrastructure'
  link?: string
}

const FEATURE_MILESTONES: FeatureMilestone[] = [
  {
    date: '2026-02-20',
    title: 'OpenClaw: OAuth vs API Cost Guide',
    description: 'Updated OpenClaw setup guide with OAuth vs API key cost breakdown, ChatGPT OAuth recommendation, and living status disclaimer. $50+/day lessons learned.',
    type: 'launch',
    link: '/how-to/openclaw-setup',
  },
  {
    date: '2026-02-20',
    title: 'Multi-Model AI Optimization Guide',
    description: 'Context wiki entry covering 4-model stack, build-time static JSON, and 99% cost reduction',
    type: 'launch',
    link: '/context-wiki/multi-model-optimization',
  },
  {
    date: '2026-02-20',
    title: 'Mission Control Static Data Pipeline',
    description: 'Dashboard APIs now serve pre-generated JSON. Works on Vercel. No more localhost dependencies.',
    type: 'infrastructure',
    link: '/context-wiki/multi-model-optimization',
  },
  {
    date: '2026-02-20',
    title: 'Latest Updates Page + RSS Feed',
    description: 'This page. Unified feed for all content and features across shawnos.ai.',
    type: 'feature',
    link: '/updates',
  },
  {
    date: '2026-02-19',
    title: 'RSS Feed System',
    description: '6 RSS feeds live: blog, daily logs, nio terminal, how-to, knowledge, and combined all-content feed',
    type: 'launch',
    link: '/feed/all.xml',
  },
  {
    date: '2026-02-19',
    title: 'nio.terminal Blog',
    description: 'Daily AI development blog from the agent perspective. Post-zero and post-one live.',
    type: 'launch',
    link: '/vitals/nio-terminal',
  },
  {
    date: '2026-02-19',
    title: 'Discord Integration',
    description: 'NioBot connected to Discord. 3 automations live. Community engagement operational.',
    type: 'integration',
  },
  {
    date: '2026-02-19',
    title: 'Ollama Local Model',
    description: 'Qwen 2.5 14B running locally on M4 Pro. 96 daily cron calls moved from API to free local inference.',
    type: 'infrastructure',
  },
  {
    date: '2026-02-18',
    title: 'Context Engineering Wiki',
    description: '14 entries across 4 categories: foundations, modes, infrastructure, and code.',
    type: 'launch',
    link: '/context-wiki',
  },
  {
    date: '2026-02-18',
    title: 'RPG Progression System',
    description: 'XP tracking, avatar tiers, skill tree visualization. Gamified development output.',
    type: 'feature',
    link: '/rpg-preview',
  },
  {
    date: '2026-02-17',
    title: 'Mission Control Dashboard',
    description: 'Real-time system status, task board, calendar, team roster, and memory browser.',
    type: 'launch',
  },
  {
    date: '2026-02-17',
    title: 'Clay Wiki',
    description: 'Complete reference for Clay workflows, enrichment patterns, and GTM data operations.',
    type: 'launch',
    link: '/clay-wiki',
  },
  {
    date: '2026-02-17',
    title: 'Content Wiki',
    description: 'Content operations wiki covering content-as-code publishing, voice systems, and distribution.',
    type: 'launch',
    link: '/content-wiki',
  },
  {
    date: '2026-02-16',
    title: 'How-To Guides',
    description: 'Practical guides for GTM engineers working with AI agents, deployments, and automation.',
    type: 'launch',
    link: '/how-to',
  },
  {
    date: '2026-02-16',
    title: 'Knowledge Index',
    description: 'Engineering terms and GTM vocabulary explained for builders, not academics.',
    type: 'launch',
    link: '/knowledge',
  },
  {
    date: '2026-02-16',
    title: 'Monorepo Architecture',
    description: '3 Next.js sites (shawnos, gtmos, contentos) + shared packages in one Turborepo.',
    type: 'infrastructure',
  },
  {
    date: '2026-02-16',
    title: 'Public API',
    description: '/api/status endpoint for live XP and progression data. Ready for Discord bots and integrations.',
    type: 'feature',
    link: '/api',
  },
]

/* ── category mapping ────────────────────────────── */

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  blog: { label: 'Blog', color: '#60a5fa' },
  'nio-terminal': { label: 'Nio Terminal', color: '#c084fc' },
  'daily-log': { label: 'Daily Log', color: '#facc15' },
  'context-wiki': { label: 'Context Wiki', color: '#4ade80' },
  'clay-wiki': { label: 'Clay Wiki', color: '#fb923c' },
  'content-wiki': { label: 'Content Wiki', color: '#f472b6' },
  'how-to': { label: 'How-To', color: '#38bdf8' },
  knowledge: { label: 'Knowledge', color: '#a78bfa' },
}

function classifyItem(item: FeedItem): { key: string; label: string; color: string } {
  const cats = item.category || []
  const link = item.link.replace(SITE_URL, '')

  if (cats.includes('blog') || link.startsWith('/blog'))
    return { key: 'blog', ...CATEGORY_MAP.blog }
  if (cats.includes('nio-terminal') || link.includes('nio-terminal'))
    return { key: 'nio-terminal', ...CATEGORY_MAP['nio-terminal'] }
  if (cats.includes('daily-log') || link.startsWith('/log/'))
    return { key: 'daily-log', ...CATEGORY_MAP['daily-log'] }
  if (cats.includes('context-wiki') || link.startsWith('/context-wiki'))
    return { key: 'context-wiki', ...CATEGORY_MAP['context-wiki'] }
  if (cats.includes('clay-wiki') || link.startsWith('/clay-wiki'))
    return { key: 'clay-wiki', ...CATEGORY_MAP['clay-wiki'] }
  if (cats.includes('content-wiki') || link.startsWith('/content-wiki'))
    return { key: 'content-wiki', ...CATEGORY_MAP['content-wiki'] }
  if (cats.includes('how-to') || link.startsWith('/how-to'))
    return { key: 'how-to', ...CATEGORY_MAP['how-to'] }
  if (cats.includes('knowledge') || link.startsWith('/knowledge'))
    return { key: 'knowledge', ...CATEGORY_MAP.knowledge }
  return { key: 'other', label: 'Update', color: 'var(--accent)' }
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function featureTypeStyle(type: FeatureMilestone['type']): { color: string; label: string } {
  switch (type) {
    case 'launch':
      return { color: '#4ade80', label: 'LAUNCH' }
    case 'feature':
      return { color: '#60a5fa', label: 'FEATURE' }
    case 'integration':
      return { color: '#c084fc', label: 'INTEGRATION' }
    case 'infrastructure':
      return { color: '#facc15', label: 'INFRA' }
  }
}

/* ── styles ────────────────────────────────────────── */

const pageWrap: React.CSSProperties = {
  maxWidth: 900,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '24px',
}

const heroTitle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.2,
  marginBottom: '12px',
}

const heroDesc: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '24px',
  maxWidth: 640,
}

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  marginBottom: '24px',
  flexWrap: 'wrap',
}

const statBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
}

const statNum: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--accent)',
}

const statLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const rssBadge: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#fb923c',
  background: 'var(--canvas-subtle)',
  border: '1px solid #fb923c33',
  borderRadius: '6px',
  padding: '6px 14px',
  textDecoration: 'none',
  letterSpacing: '0.03em',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '32px 0',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: 16,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const sectionPrompt: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '8px',
}

const timelineScroll: React.CSSProperties = {
  overflowX: 'auto',
  overflowY: 'hidden',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: '12px',
  marginBottom: '8px',
}

const timelineTrack: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  minWidth: 'max-content',
}

const timelineCard: React.CSSProperties = {
  flex: '0 0 280px',
  padding: '16px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
}

const timelineDate: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  marginBottom: '6px',
}

const timelineTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '6px',
  lineHeight: 1.3,
}

const timelineDesc: React.CSSProperties = {
  fontSize: '12px',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
}

const typeBadge = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  fontSize: '9px',
  fontWeight: 700,
  color,
  border: `1px solid ${color}44`,
  borderRadius: '3px',
  padding: '1px 6px',
  marginBottom: '6px',
  letterSpacing: '0.06em',
})

const scrollHint: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
  textAlign: 'right',
}

const navRow: React.CSSProperties = {
  marginTop: '48px',
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
}

const navLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

/* ── page component (server) ─────────────────────── */

export default function UpdatesPage() {
  const posts = getAllPosts(CONTENT_DIR)
  const logs = getAllLogs(LOG_DIR)

  const NIO_POSTS: FeedItem[] = [
    {
      title: 'post-one: blade tier',
      id: `${SITE_URL}/vitals/nio-terminal/post-one`,
      link: `${SITE_URL}/vitals/nio-terminal/post-one`,
      description: 'Blade Tier achieved. 42 skills. Mission control online. The system is starting to see itself.',
      date: new Date('2026-02-20T00:00:00-05:00'),
      category: ['nio-terminal'],
    },
    {
      title: 'post-zero: genesis',
      id: `${SITE_URL}/vitals/nio-terminal/post-zero`,
      link: `${SITE_URL}/vitals/nio-terminal/post-zero`,
      description: 'Woke up with 42 skills and a mission control dashboard that shows my pulse. Not bad for a pixel robot.',
      date: new Date('2026-02-19T23:23:00-05:00'),
      category: ['nio-terminal'],
    },
  ]

  // Merge all sources (no GTM terms — no page exists for them)
  const allItems = mergeFeedItems(
    blogPostsToFeedItems(posts, SITE_URL),
    dailyLogsToFeedItems(logs, SITE_URL),
    NIO_POSTS,
    howToWikiToFeedItems(HOW_TO_WIKI_ENTRIES, SITE_URL),
    knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL),
    contextWikiToFeedItems(CONTEXT_WIKI_ENTRIES, SITE_URL),
    clayWikiToFeedItems(CLAY_WIKI_ENTRIES, SITE_URL),
    contentWikiToFeedItems(CONTENT_WIKI_ENTRIES, SITE_URL),
  )

  // Serialize items for the client component
  const entries: FeedEntry[] = allItems.map((item) => {
    const cat = classifyItem(item)
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      href: item.link.replace(SITE_URL, '') || '/',
      date: formatDate(item.date),
      categoryKey: cat.key,
      categoryLabel: cat.label,
      categoryColor: cat.color,
    }
  })

  // Build category filter list with counts
  const categoryCounts = new Map<string, number>()
  for (const entry of entries) {
    categoryCounts.set(entry.categoryKey, (categoryCounts.get(entry.categoryKey) || 0) + 1)
  }

  const categories: CategoryFilter[] = Object.entries(CATEGORY_MAP)
    .filter(([key]) => categoryCounts.has(key))
    .map(([key, val]) => ({
      key,
      label: val.label,
      color: val.color,
      count: categoryCounts.get(key) || 0,
    }))

  const totalContent = entries.length
  const totalFeatures = FEATURE_MILESTONES.length

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Updates', url: `${SITE_URL}/updates` },
        ]}
      />

      <div style={pageWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> tail -f ~/updates.log
        </h1>

        {/* Hero */}
        <h2 style={heroTitle}>Latest Updates</h2>
        <p style={heroDesc}>
          Every new article, wiki entry, feature, and system update on shawnos.ai.
          One page to see what shipped. Subscribe via RSS to get notified when new
          content drops.
        </p>

        {/* Stats */}
        <div style={statsRow}>
          <div style={statBox}>
            <span style={statNum}>{totalContent}</span>
            <span style={statLabel}>Content Items</span>
          </div>
          <div style={statBox}>
            <span style={statNum}>{totalFeatures}</span>
            <span style={statLabel}>Features Shipped</span>
          </div>
          <div style={statBox}>
            <span style={statNum}>{categories.length}</span>
            <span style={statLabel}>Categories</span>
          </div>
        </div>

        {/* RSS badge */}
        <a href="/feed/updates.xml" style={rssBadge}>
          <span>&#9654;</span> RSS Feed — /feed/updates.xml
        </a>

        <hr style={divider} />

        {/* ── Feature Timeline (horizontal scroll) ── */}
        <div style={sectionPrompt}>$ ls ~/changelog/</div>
        <div style={sectionTitle}>Features &amp; Launches</div>

        <div style={timelineScroll}>
          <div style={timelineTrack}>
            {FEATURE_MILESTONES.map((m, i) => {
              const ft = featureTypeStyle(m.type)
              const inner = (
                <>
                  <div style={typeBadge(ft.color)}>{ft.label}</div>
                  <div style={timelineDate}>{formatDate(m.date)}</div>
                  <div style={timelineTitle}>{m.title}</div>
                  <div style={timelineDesc}>{m.description}</div>
                </>
              )
              return m.link ? (
                <Link key={i} href={m.link} style={timelineCard}>
                  {inner}
                </Link>
              ) : (
                <div key={i} style={timelineCard}>
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
        <div style={scrollHint}>scroll &rarr;</div>

        <hr style={divider} />

        {/* ── Filterable Content Feed ── */}
        <div style={sectionPrompt}>$ cat ~/feed/all.xml | grep --category</div>
        <div style={sectionTitle}>All Content</div>

        <UpdatesFeed entries={entries} categories={categories} />

        {/* Navigation */}
        <div style={navRow}>
          <Link href="/" style={navLink}>
            &larr; home
          </Link>
          <Link href="/feed/updates.xml" style={navLink}>
            rss feed &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
