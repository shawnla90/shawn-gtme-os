import type { Metadata } from 'next'
import Link from 'next/link'
import {
  TerminalChrome,
  TypewriterHero,
  ScrambleCycler,
  AvatarBadge,
} from '@shawnos/shared/components'
import { ShowcaseCard } from './ShowcaseCard'
import { ShowcaseReveal, ScrollRevealSection, PageHero, SectionHeadline } from './ShowcaseReveal'

/* ── metadata ──────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Component Showcase',
  description:
    'Live demos of the React components, animation systems, and RPG engine powering shawnos.ai — built from scratch, no libraries.',
  keywords: [
    'React components',
    'Remotion video generation',
    'RPG progression engine',
    'terminal UI',
    'typewriter animation',
    'text scramble effect',
    'content pipeline',
    'monorepo',
    'Next.js',
    'TypeScript',
  ],
  alternates: { canonical: 'https://shawnos.ai/showcase' },
  openGraph: {
    title: 'Component Showcase | shawnos.ai',
    description:
      'Live demos of the React components and systems powering shawnos.ai.',
    url: 'https://shawnos.ai/showcase',
    images: [
      {
        url: '/og?title=Component+Showcase&subtitle=Live+demos.+Built+from+scratch.',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Component Showcase | shawnos.ai',
    description:
      'Live demos of the React components and systems powering shawnos.ai.',
    images: [
      '/og?title=Component+Showcase&subtitle=Live+demos.+Built+from+scratch.',
    ],
  },
}

/* ── static data ───────────────────────────────────── */

const avatarTiers = [
  { tier: 1, label: 'Tier 1', color: '#8B9BB4' },
  { tier: 2, label: 'Tier 2', color: '#6B8FA8' },
  { tier: 3, label: 'Tier 3', color: '#4EC373' },
  { tier: 4, label: 'Tier 4', color: '#4EA8C3' },
]

const videoComponents = [
  'SceneWrapper',
  'ChatBubble',
  'GraphNode',
  'GraphEdge',
  'TerminalCommandLine',
  'XpBar',
  'CostMeter',
  'OrbitingIcons',
  'TypingDots',
  'NioChatReveal',
  'NioGenesis',
  'NioKnowledgeGraph',
  'TikTokSlide',
]

const exampleSpec = `{
  "composition": "NioGenesis",
  "durationInFrames": 300,
  "fps": 30,
  "props": {
    "title": "ShawnOS.ai",
    "subtitle": "GTM engineering, built in public",
    "tier": 3,
    "showXpBar": true,
    "accentColor": "#4EC373"
  }
}`

const pipelineStages = [
  { label: 'Markdown source', note: '.md files in /content/website/final' },
  { label: 'unified / remark', note: 'parse + transform AST' },
  { label: 'rehype-highlight', note: 'syntax highlighting' },
  { label: 'Next.js build', note: 'static generation at build time' },
  { label: 'Blog / Wiki / Feed', note: 'HTML + 7 RSS feeds + sitemap' },
]

/* ── styles ────────────────────────────────────────── */

const pagePad: React.CSSProperties = {
  maxWidth: '720px',
  margin: '0 auto',
  fontFamily: 'var(--font-mono)',
}

const sectionGap: React.CSSProperties = {
  marginBottom: '32px',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '40px 0',
}

const monoCode: React.CSSProperties = {
  display: 'block',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '16px 20px',
  fontSize: '12px',
  lineHeight: 1.8,
  color: 'var(--text-primary)',
  overflowX: 'auto',
  whiteSpace: 'pre',
}

/* ── page ──────────────────────────────────────────── */

export default function ShowcasePage() {
  return (
    <>
      <PageHero
        compact
        title="Showcase"
        subtitle="Live demos of every system."
      />

      {/* ───────────────────────────────────────────── */}
      {/* Section 1: Terminal UI System                 */}
      {/* ───────────────────────────────────────────── */}
      <ScrollRevealSection background="var(--canvas)">
        <ShowcaseCard
          title="terminal-ui"
          description="Custom terminal chrome used across all pages. macOS traffic-lights titlebar, dark canvas background, monospace content area."
          stats={['TerminalChrome', 'zero deps']}
        >
          <TerminalChrome title="shawnos.ai — ~/demo">
            <div
              style={{
                fontSize: '13px',
                lineHeight: 2,
                color: 'var(--text-secondary)',
              }}
            >
              <div>
                <span style={{ color: 'var(--accent)' }}>$</span>{' '}
                <span style={{ color: 'var(--text-primary)' }}>
                  ./boot ShawnOS.ai
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--accent)' }}>[OK]</span>{' '}
                monorepo mounted
              </div>
              <div>
                <span style={{ color: 'var(--accent)' }}>[OK]</span> three-site
                network synced
              </div>
              <div>
                <span style={{ color: 'var(--accent)' }}>[OK]</span> content
                pipeline online
              </div>
              <div>
                <span style={{ color: 'var(--accent)' }}>[OK]</span> RPG engine
                active
              </div>
              <div style={{ color: 'var(--accent)', fontWeight: 600 }}>
                &gt; all systems operational_
              </div>
            </div>
          </TerminalChrome>
        </ShowcaseCard>
      </ScrollRevealSection>

      {/* ───────────────────────────────────────────── */}
      {/* Section 2: Animation System                   */}
      {/* ───────────────────────────────────────────── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <ShowcaseCard
          title="animation-system"
          description="Two pure-React animation primitives. TypewriterHero types and erases sequences at configurable speeds. ScrambleCycler scrambles text into noise then resolves it left-to-right into the next phrase."
          stats={['TypewriterHero', 'ScrambleCycler', 'Framer Motion', 'SSR-safe']}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            {/* TypewriterHero demo */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                typewriter-hero
              </div>
              <div
                style={{
                  padding: '20px',
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              >
                <TypewriterHero
                  siteName="ShawnOS.ai"
                  sequences={[
                    {
                      text: 'GTM engineering, built in public.',
                      pauseAfter: 2500,
                    },
                    {
                      text: 'S.H.A.W.N. — Self-Hosted AI Workspace Node',
                      color: 'accent',
                      pauseAfter: 3000,
                    },
                    {
                      text: 'one monorepo. every system. shipped.',
                      pauseAfter: 2500,
                    },
                  ]}
                  maxWidth={480}
                />
              </div>
            </div>

            {/* ScrambleCycler demo */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                scramble-cycler
              </div>
              <div
                style={{
                  padding: '20px',
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  minHeight: '56px',
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>$</span> skill:
                </span>
                <ScrambleCycler
                  phrases={[
                    'GTM ENGINEERING',
                    'CONTENT SYSTEMS',
                    'AI AUTOMATION',
                    'PIPELINE DESIGN',
                    'BUILD IN PUBLIC',
                  ]}
                  holdMs={2500}
                  scrambleSpeed={28}
                  resolveSpeed={45}
                />
              </div>
            </div>
          </div>
        </ShowcaseCard>
      </ScrollRevealSection>

      {/* ───────────────────────────────────────────── */}
      {/* Section 3: RPG Progression Engine             */}
      {/* ───────────────────────────────────────────── */}
      <ScrollRevealSection background="var(--canvas)">
        <ShowcaseCard
          title="rpg-progression-engine"
          description="XP accrues from real daily work — commits, content, deployments. Python engine scores each day and evolves the avatar. Hover any sprite to trigger the action animation."
          stats={[
            '6 tiers',
            '5 classes',
            '470+ sprite assets',
            'Python scored',
          ]}
        >
          {/* Tier sprites grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {avatarTiers.map(({ tier, label, color }) => (
              <TierSprite key={tier} tier={tier} label={label} color={color} />
            ))}
          </div>

          {/* AvatarBadge sample with static data */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                avatar-badge (compact)
              </div>
              <AvatarBadge
                size="compact"
                profile={{
                  name: 'Shawn',
                  title: 'Repo Architect',
                  level: 12,
                  xp_total: 3800,
                  xp_next_level: 5000,
                  class: 'Builder',
                  avatar_tier: 3,
                  scoring_log: [],
                  milestones: [],
                  updated_at: '2026-02-25T00:00:00Z',
                }}
                avatarIdleSrc="/progression/avatars/tier-3-idle-128.gif"
                avatarActionSrc="/progression/avatars/tier-3-action-128.gif"
              />
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                class roster
              </div>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
              >
                {(['Builder', 'Scribe', 'Strategist', 'Alchemist', 'Polymath'] as const).map(
                  (cls) => (
                    <div
                      key={cls}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        background: 'var(--canvas)',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/progression/avatars/class-${cls.toLowerCase()}-idle-64.gif`}
                        alt={cls}
                        width={20}
                        height={20}
                        style={{ imageRendering: 'pixelated' }}
                      />
                      {cls}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </ShowcaseCard>
      </ScrollRevealSection>

      {/* ───────────────────────────────────────────── */}
      {/* Section 4: Video Generation                   */}
      {/* ───────────────────────────────────────────── */}
      <ScrollRevealSection background="var(--canvas-subtle)">
        <ShowcaseCard
          title="video-generation"
          description="40+ Remotion compositions. AI generates videos from a JSON TimelineSpec — pass a spec, get back an MP4. Scenes are composable React components with frame-accurate timing."
          stats={['40+ compositions', 'Remotion 4', 'JSON-driven', 'AI spec gen']}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* JSON spec sample */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                example TimelineSpec (JSON input)
              </div>
              <code style={monoCode}>{exampleSpec}</code>
            </div>

            {/* Component list */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                available scene components
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {videoComponents.map((comp) => (
                  <span
                    key={comp}
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      background: 'var(--canvas)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ShowcaseCard>
      </ScrollRevealSection>

      {/* ───────────────────────────────────────────── */}
      {/* Section 5: Content Pipeline                   */}
      {/* ───────────────────────────────────────────── */}
      <ScrollRevealSection background="var(--canvas)">
        <ShowcaseCard
          title="content-pipeline"
          description="Markdown files checked into the repo become blog posts, wiki pages, how-to guides, and 7 RSS feeds — all at build time. No CMS. No database. Git is the source of truth."
          stats={['7 RSS feeds', 'auto sitemap', 'unified/remark/rehype', 'zero-CMS']}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {pipelineStages.map((stage, i) => (
              <div
                key={stage.label}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                {/* Connector line */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      marginTop: '5px',
                      flexShrink: 0,
                    }}
                  />
                  {i < pipelineStages.length - 1 && (
                    <div
                      style={{
                        width: '1px',
                        height: '28px',
                        background: 'var(--border)',
                        marginTop: '2px',
                      }}
                    />
                  )}
                </div>

                {/* Stage info */}
                <div style={{ paddingBottom: i < pipelineStages.length - 1 ? '8px' : 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {stage.label}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginTop: '2px',
                    }}
                  >
                    {stage.note}
                  </div>
                </div>
              </div>
            ))}

            {/* Outputs grid */}
            <div
              style={{
                marginTop: '8px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '10px',
              }}
            >
              {[
                { label: '7 blog posts', href: '/blog' },
                { label: '7 RSS feeds', href: '/feed.xml' },
                { label: 'how-to guides', href: '/how-to' },
                { label: 'clay wiki', href: '/clay-wiki' },
                { label: 'daily logs', href: '/log' },
                { label: 'auto sitemap', href: '/sitemap.xml' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  style={{
                    display: 'block',
                    padding: '10px 14px',
                    background: 'var(--canvas)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  {label} &rarr;
                </Link>
              ))}
            </div>
          </div>
        </ShowcaseCard>
      </ScrollRevealSection>

      {/* ── CTA footer ── */}
      <ScrollRevealSection background="var(--canvas-subtle)" variant="scale">
      <div
        style={{
          padding: '24px',
          background: 'var(--canvas-subtle)',
          border: '1px solid var(--accent)',
          borderRadius: '8px',
          marginBottom: '48px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--accent)',
            marginBottom: '8px',
          }}
        >
          built in public. every commit tracked.
        </div>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            marginBottom: '16px',
          }}
        >
          follow the daily log to see how each system gets built, one commit at
          a time.
        </p>
        <div
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link
            href="/log"
            style={{
              display: 'inline-block',
              padding: '10px 22px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              color: 'var(--canvas)',
              background: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            read the log &rarr;
          </Link>
          <Link
            href="/about"
            style={{
              display: 'inline-block',
              padding: '10px 22px',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
              background: 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            about
          </Link>
        </div>
      </div>
      </ScrollRevealSection>
    </>
  )
}

/* ── TierSprite sub-component ───────────────────────── */
/* Inline since it's showcase-only and small             */

function TierSprite({
  tier,
  label,
  color,
}: {
  tier: number
  label: string
  color: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '12px',
        background: 'var(--canvas)',
        border: `1px solid ${color}40`,
        borderRadius: '6px',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/progression/avatars/tier-${tier}-idle-128.gif`}
        alt={`Tier ${tier} avatar`}
        width={64}
        height={64}
        style={{ imageRendering: 'pixelated', display: 'block' }}
      />
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
    </div>
  )
}
