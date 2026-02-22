import type { Metadata } from 'next'
import Link from 'next/link'
import path from 'path'
import {
  getAllLogs,
  resolveDataRoot,
  dailyLogsToFeedItems,
  howToWikiToFeedItems,
  knowledgeToFeedItems,
  clayWikiToFeedItems,
  gtmTermsToFeedItems,
  mergeFeedItems,
} from '@shawnos/shared/lib'
import type { FeedItem } from '@shawnos/shared/lib'
import { HOW_TO_WIKI_ENTRIES, getHowToWikiEntriesBySite } from '@shawnos/shared/data/how-to-wiki'
import { ENGINEERING_CATEGORIES } from '@shawnos/shared/data/engineering-terms'
import { GTM_CATEGORIES } from '@shawnos/shared/data/gtm-terms'
import { CLAY_WIKI_ENTRIES } from '@shawnos/shared/data/clay-wiki'
import { BreadcrumbSchema, UpdatesFeed } from '@shawnos/shared/components'
import type { FeedEntry, CategoryFilter } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'
const SHAWNOS_URL = 'https://shawnos.ai'
const DATA_ROOT = resolveDataRoot()
const LOG_DIR = path.join(DATA_ROOT, 'daily-log')

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Latest Updates | What\'s New on theGTMOS.ai',
  description:
    'Pipeline playbooks, Clay workflows, GTM knowledge, and system updates. Everything new on theGTMOS.ai — the go-to-market operating system.',
  keywords: [
    'gtm updates',
    'gtmos changelog',
    'go to market updates',
    'clay workflow updates',
    'gtm engineering changelog',
    'pipeline automation updates',
    'gtm knowledge base',
    'thegtmos updates',
  ],
  alternates: {
    canonical: `${SITE_URL}/updates`,
  },
  openGraph: {
    title: 'Latest Updates | What\'s New on theGTMOS.ai',
    description:
      'Pipeline playbooks, Clay workflows, and GTM knowledge. Everything new on theGTMOS.ai.',
    url: `${SITE_URL}/updates`,
  },
  twitter: {
    title: 'Latest Updates | What\'s New on theGTMOS.ai',
    description:
      'Pipeline playbooks, Clay workflows, and GTM knowledge. Everything new on theGTMOS.ai.',
  },
}

/* ── feature milestones (GTM-relevant) ───────────── */

interface FeatureMilestone {
  date: string
  title: string
  description: string
  type: 'feature' | 'launch' | 'integration' | 'infrastructure'
  link?: string
}

const FEATURE_MILESTONES: FeatureMilestone[] = [
  {
    date: '2026-02-22',
    title: 'Cross-Site Updates Pages',
    description: 'Updates feed live on all 3 sites. Full cross-site backlinking across shawnos.ai, thegtmos.ai, thecontentos.ai.',
    type: 'feature',
    link: '/updates',
  },
  {
    date: '2026-02-20',
    title: 'GEO & SEO Infrastructure',
    description: 'Full GEO/AEO/SEO content layer across the network. Knowledge terms, how-to guides, llms.txt, and multi-format RSS feeds.',
    type: 'launch',
    link: '/knowledge',
  },
  {
    date: '2026-02-20',
    title: 'OpenClaw: OAuth vs API Cost Guide',
    description: 'OpenClaw setup guide with OAuth vs API key cost breakdown. $50+/day lessons learned.',
    type: 'launch',
    link: `${SHAWNOS_URL}/how-to/openclaw-setup`,
  },
  {
    date: '2026-02-18',
    title: 'RPG Progression System',
    description: 'XP tracking, avatar tiers, skill tree visualization. Gamified development output.',
    type: 'feature',
    link: '/vitals',
  },
  {
    date: '2026-02-17',
    title: 'Clay Wiki',
    description: 'Complete reference for Clay workflows, enrichment patterns, and GTM data operations.',
    type: 'launch',
    link: '/clay-wiki',
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
    title: 'GTM Knowledge Index',
    description: 'GTM terms and pipeline vocabulary explained for builders.',
    type: 'launch',
    link: '/knowledge/gtm',
  },
]

/* ── category mapping ────────────────────────────── */

const CATEGORY_MAP: Record<string, { label: string; color: string; isReference?: boolean }> = {
  'daily-log': { label: 'Daily Log', color: '#facc15' },
  'clay-wiki': { label: 'Clay Wiki', color: '#fb923c', isReference: true },
  'gtm-knowledge': { label: 'GTM Knowledge', color: '#34d399', isReference: true },
  knowledge: { label: 'Engineering Knowledge', color: '#a78bfa', isReference: true },
  'how-to': { label: 'How-To', color: '#38bdf8', isReference: true },
  'cross-site': { label: 'From ShawnOS', color: '#60a5fa' },
}

function classifyItem(item: FeedItem): { key: string; label: string; color: string; isReference: boolean } {
  const cats = item.category || []
  const link = item.link

  if (cats.includes('daily-log') || link.includes('/log/'))
    return { key: 'daily-log', ...CATEGORY_MAP['daily-log'], isReference: false }
  if (cats.includes('clay-wiki') || link.includes('/clay-wiki'))
    return { key: 'clay-wiki', ...CATEGORY_MAP['clay-wiki'], isReference: true }
  if (cats.includes('gtm-knowledge'))
    return { key: 'gtm-knowledge', ...CATEGORY_MAP['gtm-knowledge'], isReference: true }
  if (cats.includes('knowledge'))
    return { key: 'knowledge', ...CATEGORY_MAP.knowledge, isReference: true }
  if (cats.includes('how-to') || link.includes('/how-to'))
    return { key: 'how-to', ...CATEGORY_MAP['how-to'], isReference: true }
  if (link.startsWith(SHAWNOS_URL))
    return { key: 'cross-site', ...CATEGORY_MAP['cross-site'], isReference: false }
  return { key: 'other', label: 'Update', color: 'var(--accent)', isReference: false }
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

const networkRow: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginTop: '12px',
  flexWrap: 'wrap',
}

const networkLink: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '8px 16px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
}

/* ── page component (server) ─────────────────────── */

export default function UpdatesPage() {
  const logs = getAllLogs(LOG_DIR)
  const gtmHowTos = getHowToWikiEntriesBySite('gtmos')

  // Dated sources
  const datedItems = mergeFeedItems(
    dailyLogsToFeedItems(logs, SITE_URL),
  )

  // Cross-site blog posts (from shawnos.ai — creates backlinks)
  const crossSitePosts: FeedItem[] = [
    {
      title: 'Content Clusters and the Breadcrumb Protocol',
      id: `${SHAWNOS_URL}/blog/content-cluster-breadcrumbs`,
      link: `${SHAWNOS_URL}/blog/content-cluster-breadcrumbs`,
      description: 'Hub-and-spoke content topology for SEO — the architecture behind cross-site content linking.',
      date: new Date('2026-02-22T00:00:00-05:00'),
      category: ['blog'],
    },
    {
      title: 'Querying Your Repo Like a Database',
      id: `${SHAWNOS_URL}/blog/sqlite-content-index`,
      link: `${SHAWNOS_URL}/blog/sqlite-content-index`,
      description: 'SQLite index for content metadata — query your repo like a database instead of grepping files.',
      date: new Date('2026-02-22T00:00:00-05:00'),
      category: ['blog'],
    },
    {
      title: 'How I Built a Video Rendering System in React',
      id: `${SHAWNOS_URL}/blog/remotion-video-system`,
      link: `${SHAWNOS_URL}/blog/remotion-video-system`,
      description: 'React-based video rendering with Remotion — programmatic video content from code.',
      date: new Date('2026-02-22T00:00:00-05:00'),
      category: ['blog'],
    },
  ]

  // Reference sources
  const referenceItems = mergeFeedItems(
    clayWikiToFeedItems(CLAY_WIKI_ENTRIES, SITE_URL),
    gtmTermsToFeedItems(GTM_CATEGORIES, SITE_URL),
    knowledgeToFeedItems(ENGINEERING_CATEGORIES, SITE_URL),
    howToWikiToFeedItems(gtmHowTos, SITE_URL),
  )

  // Combine: dated + cross-site first, then reference
  const allItems = [...datedItems, ...crossSitePosts, ...referenceItems]

  // Serialize for client
  const entries: FeedEntry[] = allItems.map((item) => {
    const cat = classifyItem(item)
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      href: item.link.startsWith(SITE_URL)
        ? item.link.replace(SITE_URL, '') || '/'
        : item.link,
      date: formatDate(item.date),
      categoryKey: cat.key,
      categoryLabel: cat.label,
      categoryColor: cat.color,
      isReference: cat.isReference,
    }
  })

  // Category counts
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
      isReference: val.isReference,
    }))

  const datedCount = entries.filter((e) => !e.isReference).length
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
          <span style={{ color: 'var(--accent)' }}>$</span> tail -f ~/gtm-updates.log
        </h1>

        {/* Hero */}
        <h2 style={heroTitle}>GTM Updates</h2>
        <p style={heroDesc}>
          Pipeline playbooks, Clay workflows, GTM knowledge, and system updates.
          Everything new on theGTMOS.ai. Filter by category to browse the knowledge base.
        </p>

        {/* Stats */}
        <div style={statsRow}>
          <div style={statBox}>
            <span style={statNum}>{datedCount}</span>
            <span style={statLabel}>Recent Updates</span>
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

        {/* Network links */}
        <div style={networkRow}>
          <a href="https://shawnos.ai/updates" style={networkLink}>
            shawnos.ai/updates &rarr;
          </a>
          <a href="https://thecontentos.ai/updates" style={networkLink}>
            theContentOS.ai/updates &rarr;
          </a>
        </div>

        <hr style={divider} />

        {/* ── Feature Timeline ── */}
        <div style={sectionPrompt}>$ ls ~/gtm-changelog/</div>
        <div style={sectionTitle}>Features &amp; Launches</div>

        <div style={timelineScroll}>
          <div style={timelineTrack}>
            {FEATURE_MILESTONES.map((m, i) => {
              const ft = featureTypeStyle(m.type)
              const isExternal = m.link?.startsWith('http')
              const inner = (
                <>
                  <div style={typeBadge(ft.color)}>{ft.label}</div>
                  <div style={timelineDate}>{formatDate(m.date)}</div>
                  <div style={timelineTitle}>{m.title}</div>
                  <div style={timelineDesc}>{m.description}</div>
                </>
              )
              if (m.link && isExternal) {
                return (
                  <a key={i} href={m.link} style={timelineCard}>
                    {inner}
                  </a>
                )
              }
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
        <div style={sectionPrompt}>$ cat ~/feed/gtm.xml | grep --category</div>
        <div style={sectionTitle}>All GTM Content</div>

        <UpdatesFeed entries={entries} categories={categories} />

        {/* Navigation */}
        <div style={navRow}>
          <Link href="/" style={navLink}>
            &larr; home
          </Link>
          <a href="https://shawnos.ai/updates" style={navLink}>
            full network updates &rarr;
          </a>
        </div>
      </div>
    </>
  )
}
