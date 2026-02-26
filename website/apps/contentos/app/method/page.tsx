import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thecontentos.ai'

/* ── metadata ─────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Method — The 3-Tier Content Operating System',
  description:
    'The architecture behind Content OS: Voice DNA, Context Playbooks, and Content Ops. Your content strategy should be a system, not a calendar. A repo, not a spreadsheet. Infrastructure, not inspiration.',
  keywords: [
    'content operating system',
    'voice DNA',
    'content playbooks',
    'content ops',
    'AI content system',
    'content architecture',
    'voice system',
    'content infrastructure',
    'recursive content loop',
    'content automation',
  ],
  alternates: { canonical: `${SITE_URL}/method` },
  openGraph: {
    title: 'Method — The 3-Tier Content Operating System | theContentOS.ai',
    description:
      'Voice DNA, Context Playbooks, Content Ops. Your content strategy should be a system, not a calendar.',
    url: `${SITE_URL}/method`,
    images: [
      {
        url: '/og?title=The+Method&subtitle=3-Tier+Content+Operating+System',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Method — The 3-Tier Content Operating System | theContentOS.ai',
    description:
      'Voice DNA, Context Playbooks, Content Ops. Your content strategy should be a system, not a calendar.',
    images: ['/og?title=The+Method&subtitle=3-Tier+Content+Operating+System'],
  },
}

/* ── tier data ────────────────────────────────────── */

const tiers: {
  number: number
  name: string
  tag: string
  color: string
  what: string
  insight: string
  components: { name: string; desc: string }[]
}[] = [
  {
    number: 1,
    name: 'Voice DNA',
    tag: 'foundation',
    color: '#4EC373',
    what: 'Your voice encoded as rules, not vibes. The foundational layer that applies to ALL content regardless of platform. Sentence style, word choices, anti-patterns, identity markers, formatting rules. This tier inherits into everything above it.',
    insight: 'Voice is infrastructure. If it\'s not in a file, it doesn\'t scale.',
    components: [
      {
        name: 'core-voice.md',
        desc: 'Personality, tone, priority hierarchy (substance > authenticity > interesting > polish), voice modes, builder code, identity anchors, tool stack, audience',
      },
      {
        name: 'anti-slop.md',
        desc: '14 patterns (10 critical + 4 context-dependent): em-dashes, authority signaling, narrator setups, dramatic framing, bookend summaries, self-branded concepts',
      },
      {
        name: 'viral-hooks.md',
        desc: '6 hook styles as a library: curiosity pings, contrarian POVs, data bombs, story openers, problem-first, direct challenge. Platform-aware.',
      },
      {
        name: 'safety-filters.md',
        desc: 'Pattern vs. person test. What you can critique (systems, approaches) vs. what you protect (people, companies, ecosystem)',
      },
    ],
  },
  {
    number: 2,
    name: 'Context Playbooks',
    tag: 'adaptation',
    color: '#9B72CF',
    what: 'Platform-specific rules that adapt Voice DNA to each channel. Each playbook inherits from Tier 1 but has its own constraints. The voice stays consistent but the format, length, and delivery adapt per platform.',
    insight: 'Same voice, different format. The playbook handles the translation.',
    components: [
      {
        name: 'linkedin.md',
        desc: '5 content pillars, emoji system (structural not decorative), sign-off style, CTA types, comment strategy, paragraph structure for mobile',
      },
      {
        name: 'x-twitter.md',
        desc: 'Compression rules, thread format (4-6 tweets), 280-char awareness, cross-posting schedule, meme/hot-take native content',
      },
      {
        name: 'substack.md',
        desc: 'Long-form structures (POV essay, tactical breakdown, contrarian take, curated drop), subject line style, visual strategy, 8 anti-slop patterns',
      },
      {
        name: 'tiktok.md',
        desc: '16-second structure (hook/demo/result/closer), 6 content series, visual + audio rules, Twitch stream repurpose pipeline',
      },
      {
        name: 'youtube.md',
        desc: 'Expanded walkthroughs, episode format, migration from LinkedIn screen recordings',
      },
      {
        name: 'client-comms.md',
        desc: 'Email, deck, and recap tone. Diagnosis-impact-next structure for client communication',
      },
    ],
  },
  {
    number: 3,
    name: 'Content Ops',
    tag: 'execution',
    color: '#D2A53C',
    what: 'The automation and production infrastructure. This tier operationalizes the voice, turning principles into checklists, workflows, and content pipelines. Where Tier 1 says who you are and Tier 2 says how you adapt, Tier 3 says how you ship.',
    insight: 'Ops is what makes it sustainable. Without it, you\'re just writing posts.',
    components: [
      {
        name: 'pre-publish-checklist.md',
        desc: 'Structure, substance, safety, and voice checks. 4-gate system that runs before anything goes live.',
      },
      {
        name: 'substance-requirements.md',
        desc: 'What qualifies as substance vs. sugar rush. Every claim needs 2+ of: specific example, technical implementation, reasoning, consequences, gotchas.',
      },
      {
        name: 'improvement-protocol.md',
        desc: '6-step draft improvement: remove slop, add specificity, show technical depth, trim performance, check safety, verify voice.',
      },
      {
        name: 'pitfalls.md',
        desc: '4 traps to avoid: thought leader, generic advice, over-polish, too technical. Each with detection patterns.',
      },
      {
        name: 'success-patterns.md',
        desc: 'What works (long tactical posts, build logs, pattern recognition) vs. what doesn\'t (short abstract advice, generic tips, corporate content).',
      },
      {
        name: '12 content pillars',
        desc: 'Plays Series, Building & Sharing, GTM Memes, Release Reactions, Skill System Shares, Newsletter Editorial, Newsletter Growth, Newsletter Repurpose, Reddit Growth & SEO, YouTube Builder Systems, X Micro-Tips, Twitch Gaming + Discord.',
      },
    ],
  },
]

/* ── platform grid data ──────────────────────────── */

const platforms: {
  name: string
  format: string
  keyRule: string
}[] = [
  {
    name: 'LinkedIn',
    format: '1-2 sentence paragraphs, emoji markers, screen recordings',
    keyRule: 'The post is the hook. The comments are the delivery.',
  },
  {
    name: 'X / Twitter',
    format: '280-char tweets, 4-6 tweet threads, single-tweet hot takes',
    keyRule: 'Every tweet stands alone. No context required.',
  },
  {
    name: 'Substack',
    format: '300-800 words, markdown-native, inline code + screenshots',
    keyRule: 'Deeper version of what you already wrote on social.',
  },
  {
    name: 'TikTok',
    format: '16-sec videos, on-screen text IS the hook, screen recordings',
    keyRule: 'The demo IS the content. No intros.',
  },
  {
    name: 'YouTube',
    format: '5-15 min walkthroughs, episode format, expanded plays',
    keyRule: 'LinkedIn screen recordings expanded with voiceover.',
  },
  {
    name: 'Reddit',
    format: 'Conversational long-form, subreddit-native, SEO-driven',
    keyRule: 'Written for a smart friend in a niche community.',
  },
]

/* ── stack data ──────────────────────────────────── */

const stackItems: { tool: string; role: string }[] = [
  { tool: 'Cursor IDE', role: 'Primary editor. Where content files live and agents run.' },
  { tool: 'Claude Code', role: 'AI agent orchestration. Skills, slash commands, content generation.' },
  { tool: 'Python + Pillow', role: 'Programmatic image generation. OG images, social cards, branded visuals.' },
  { tool: 'Typefully', role: 'Publishing pipeline. LinkedIn and X scheduling via MCP integration.' },
  { tool: 'Next.js + Vercel', role: 'The websites. Three sites in a monorepo, deployed on every push.' },
  { tool: 'Git', role: 'Version control. Every voice rule, every pillar, every playbook is a commit.' },
]

/* ── pipeline steps ──────────────────────────────── */

const pipelineSteps: { label: string; desc: string }[] = [
  { label: 'Signal', desc: 'Daily research via Exa MCP, industry feeds, build logs' },
  { label: 'Draft', desc: 'Agent skill generates from signal + voice files + pillar template' },
  { label: 'Voice', desc: 'Anti-slop check, substance validation, voice verification' },
  { label: 'Format', desc: 'Platform playbook applies: length, structure, CTA, sign-off' },
  { label: 'Publish', desc: 'Typefully queue, Substack schedule, cross-platform distribution' },
  { label: 'Loop', desc: 'Performance data refines voice rules. Output feeds back as input.' },
]

/* ── styles ───────────────────────────────────────── */

const section: React.CSSProperties = {
  marginBottom: '48px',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  marginBottom: '16px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
}

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  marginBottom: '12px',
}

const mutedText: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '12px',
}

const monoBlock: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '16px 20px',
  overflowX: 'auto',
  whiteSpace: 'pre',
}

/* ── page ─────────────────────────────────────────── */

export default function MethodPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Method', url: `${SITE_URL}/method` }]}
      />
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* ── Terminal header ── */}
        <h1
          style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--text-muted)',
            marginBottom: '32px',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>$</span> cat ~/content-os/METHOD.md
        </h1>

        {/* ── Hero ── */}
        <div style={section}>
          <p
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--accent)',
              marginBottom: '8px',
              lineHeight: 1.3,
            }}
          >
            the 3-tier content operating system.
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-muted)',
              marginBottom: '24px',
              fontStyle: 'italic',
              lineHeight: 1.6,
            }}
          >
            your content strategy should be a system, not a calendar.
            <br />a repo, not a spreadsheet. infrastructure, not inspiration.
          </p>

          <p style={paragraph}>
            most content creators run on vibes. they open a blank doc, write
            what feels right, and hope the tone stays consistent across
            platforms. it works until it doesn&apos;t. until the LinkedIn post
            sounds nothing like the tweet. until the newsletter reads like a
            different person wrote it. until the AI-generated draft comes back
            sounding like every other AI-generated draft on the internet.
          </p>
          <p style={paragraph}>
            this is the architecture that fixes that. three tiers. each one
            builds on the one below it. the voice stays the same. the format
            adapts. the ops make it sustainable.
          </p>
        </div>

        <hr style={divider} />

        {/* ── The Problem ── */}
        <div style={section}>
          <h2 style={sectionTitle}>the problem</h2>

          <p style={paragraph}>
            content strategies fail for three reasons. not because the ideas
            are bad. because the infrastructure doesn&apos;t exist.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {[
              {
                label: 'no voice consistency',
                desc: 'every post is a fresh prompt. no persistent rules, no anti-patterns, no identity markers. the AI writes differently every time because it has no constraints to follow.',
              },
              {
                label: 'no cross-platform rules',
                desc: 'a LinkedIn post gets copy-pasted to X and Substack. no format adaptation, no length adjustment, no platform-specific CTA strategy. same content, wrong container.',
              },
              {
                label: 'no feedback loops',
                desc: 'content gets published and forgotten. no performance data feeding back into the voice rules. no pattern recognition about what works. the 100th post is as hard to write as the 1st.',
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                    minWidth: '200px',
                  }}
                >
                  {item.label}
                </span>
                <span style={mutedText}>{item.desc}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '16px 20px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--accent)',
                margin: 0,
              }}
            >
              content calendars are spreadsheets.
              <br />
              content operating systems are codebases.
            </p>
          </div>
        </div>

        <hr style={divider} />

        {/* ── The 3 Tiers ── */}
        <div style={section}>
          <h2 style={sectionTitle}>the 3 tiers</h2>

          <p style={{ ...mutedText, marginBottom: '24px' }}>
            each tier builds on the one below it. a LinkedIn post loads Tier 1
            (voice DNA) + Tier 2 (LinkedIn playbook) + Tier 3 (pre-publish
            checklist). a TikTok script loads Tier 1 + Tier 2 (TikTok playbook)
            + Tier 3 (substance requirements). the voice is modular.
          </p>

          {tiers.map((tier) => (
            <div key={tier.number} style={{ marginBottom: '36px' }}>
              {/* Tier header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: tier.color,
                  }}
                >
                  Tier {tier.number}: {tier.name}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                    padding: '1px 8px',
                    border: `1px solid ${tier.color}`,
                    borderRadius: '3px',
                  }}
                >
                  {tier.tag}
                </span>
              </div>

              {/* What it is */}
              <p style={{ ...paragraph, marginBottom: '16px' }}>
                {tier.what}
              </p>

              {/* File tree */}
              {tier.number === 1 && (
                <div style={monoBlock}>
                  <span style={{ color: '#4EC373' }}>skills/tier-1-voice-dna/</span>{'\n'}
                  <span style={{ color: '#4EC373' }}>{'├── '}</span>core-voice.md{'\n'}
                  <span style={{ color: '#4EC373' }}>{'├── '}</span>anti-slop.md{'\n'}
                  <span style={{ color: '#4EC373' }}>{'├── '}</span>viral-hooks.md{'\n'}
                  <span style={{ color: '#4EC373' }}>{'└── '}</span>safety-filters.md
                </div>
              )}

              {tier.number === 2 && (
                <div style={monoBlock}>
                  <span style={{ color: '#9B72CF' }}>skills/tier-2-context-playbooks/</span>{'\n'}
                  <span style={{ color: '#9B72CF' }}>{'├── '}</span>linkedin.md{'\n'}
                  <span style={{ color: '#9B72CF' }}>{'├── '}</span>x-twitter.md{'\n'}
                  <span style={{ color: '#9B72CF' }}>{'├── '}</span>substack.md{'\n'}
                  <span style={{ color: '#9B72CF' }}>{'├── '}</span>tiktok.md{'\n'}
                  <span style={{ color: '#9B72CF' }}>{'├── '}</span>youtube.md{'\n'}
                  <span style={{ color: '#9B72CF' }}>{'├── '}</span>client-comms.md{'\n'}
                  <span style={{ color: '#9B72CF' }}>{'└── '}</span>internal-team.md
                </div>
              )}

              {tier.number === 3 && (
                <div style={monoBlock}>
                  <span style={{ color: '#D2A53C' }}>skills/tier-3-content-ops/</span>{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'├── '}</span>pre-publish-checklist.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'├── '}</span>substance-requirements.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'├── '}</span>improvement-protocol.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'├── '}</span>pitfalls.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'├── '}</span>success-patterns.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'└── '}</span>pillars/{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>plays-series.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>building-sharing.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>gtm-memes.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>release-reactions.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>skill-system-shares.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>newsletter-editorial.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>newsletter-growth.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>newsletter-repurpose.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>reddit-growth-seo.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>youtube-builder-systems.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    ├── '}</span>x-micro-tips.md{'\n'}
                  <span style={{ color: '#D2A53C' }}>{'    └── '}</span>twitch-gaming-discord.md
                </div>
              )}

              {/* Components */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginTop: '16px',
                }}
              >
                {tier.components.map((comp) => (
                  <div key={comp.name} style={card}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: tier.color,
                        marginBottom: '6px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {comp.name}
                    </span>
                    <span style={mutedText}>{comp.desc}</span>
                  </div>
                ))}
              </div>

              {/* Key insight */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  borderLeft: `3px solid ${tier.color}`,
                  background: 'var(--canvas-subtle)',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: tier.color,
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  {tier.insight}
                </p>
              </div>
            </div>
          ))}
        </div>

        <hr style={divider} />

        {/* ── Platform Grid (Tier 2 visual) ── */}
        <div style={section}>
          <h2 style={sectionTitle}>platform adaptation grid</h2>

          <p style={{ ...mutedText, marginBottom: '20px' }}>
            same voice DNA, different containers. each platform gets its own
            format rules, length constraints, and CTA strategy.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {platforms.map((p) => (
              <div
                key={p.name}
                style={{
                  ...card,
                  marginBottom: 0,
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#9B72CF',
                    marginBottom: '8px',
                  }}
                >
                  {p.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '8px',
                  }}
                >
                  {p.format}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                  }}
                >
                  {p.keyRule}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={divider} />

        {/* ── Content Pipeline (Tier 3 visual) ── */}
        <div style={section}>
          <h2 style={sectionTitle}>the content pipeline</h2>

          <p style={{ ...mutedText, marginBottom: '20px' }}>
            from signal to publish to feedback loop. every step loads the
            right voice files and applies the right platform rules.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {pipelineSteps.map((step, i) => (
              <div
                key={step.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 16px',
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: i === 0 ? '8px 8px 2px 2px' : i === pipelineSteps.length - 1 ? '2px 2px 8px 8px' : '2px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#D2A53C',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                    minWidth: '60px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    minWidth: '70px',
                  }}
                >
                  {step.label}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {step.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={divider} />

        {/* ── How the Tiers Connect ── */}
        <div style={section}>
          <h2 style={sectionTitle}>how the tiers connect</h2>

          <p style={paragraph}>
            this is not three independent layers stacked on top of each other.
            it&apos;s a feedback system. each tier feeds the next, and the last
            tier feeds back to the first.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            {[
              {
                flow: 'Tier 1 feeds Tier 2',
                color: '#4EC373',
                desc: 'Voice DNA rules get applied per-platform. The LinkedIn playbook inherits from core-voice.md. The TikTok playbook inherits the same rules but compresses them for 16-second video. Same DNA, different expression.',
              },
              {
                flow: 'Tier 2 feeds Tier 3',
                color: '#9B72CF',
                desc: 'Platform-formatted content gets automated into production. The pre-publish checklist validates that the platform playbook was actually followed. The pillar templates structure the draft before the voice check runs.',
              },
              {
                flow: 'Tier 3 feeds back to Tier 1',
                color: '#D2A53C',
                desc: 'Performance data and production failures refine voice rules. When a post flops, the success-patterns file gets updated. When an anti-slop pattern is spotted in a published draft, the anti-slop checklist grows. The system improves itself.',
              },
            ].map((item) => (
              <div key={item.flow} style={card}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: item.color,
                    marginBottom: '8px',
                  }}
                >
                  {item.flow}
                </span>
                <span style={mutedText}>{item.desc}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '20px',
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              marginBottom: '16px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#4EC373' }}>
              Voice DNA
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {'-->'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#9B72CF' }}>
              Playbooks
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {'-->'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#D2A53C' }}>
              Content Ops
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {'-->'}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#4EC373' }}>
              Voice DNA
            </span>
          </div>

          <p
            style={{
              ...paragraph,
              fontWeight: 600,
              color: 'var(--accent)',
              textAlign: 'center',
            }}
          >
            the recursive part. the system improves itself.
          </p>

          <p style={paragraph}>
            the anti-slop guide started as 3 rules. it now catches 14+ patterns
            because each piece of generated content revealed new patterns that
            needed catching. the LinkedIn playbook started as tone notes. it now
            covers emoji systems, CTA patterns, sign-off styles, and five
            content pillars. each rule was earned by catching a specific failure
            in real content.
          </p>
        </div>

        <hr style={divider} />

        {/* ── Modular Loading ── */}
        <div style={section}>
          <h2 style={sectionTitle}>modular voice loading</h2>

          <p style={paragraph}>
            each agent skill specifies which voice files it needs. the skill
            tells the agent: before generating, read these files. the voice
            is composed per task, not loaded all at once.
          </p>

          <div style={monoBlock}>
            {'# /linkedin skill loads:\n'}
            <span style={{ color: '#4EC373' }}>{'tier-1  '}</span>{'core-voice.md + anti-slop.md\n'}
            <span style={{ color: '#9B72CF' }}>{'tier-2  '}</span>{'linkedin.md\n'}
            <span style={{ color: '#D2A53C' }}>{'tier-3  '}</span>{'pre-publish-checklist.md + [pillar].md\n'}
            {'\n'}
            {'# /tiktokscript skill loads:\n'}
            <span style={{ color: '#4EC373' }}>{'tier-1  '}</span>{'core-voice.md + viral-hooks.md\n'}
            <span style={{ color: '#9B72CF' }}>{'tier-2  '}</span>{'tiktok.md\n'}
            <span style={{ color: '#D2A53C' }}>{'tier-3  '}</span>{'substance-requirements.md\n'}
            {'\n'}
            {'# /review skill loads:\n'}
            <span style={{ color: '#4EC373' }}>{'tier-1  '}</span>{'core-voice.md + anti-slop.md + safety-filters.md\n'}
            <span style={{ color: '#9B72CF' }}>{'tier-2  '}</span>{'[platform].md\n'}
            <span style={{ color: '#D2A53C' }}>{'tier-3  '}</span>{'pre-publish-checklist.md + ai-pattern-detection/'}
          </div>

          <p style={{ ...mutedText, marginTop: '12px' }}>
            change a voice rule in the markdown file and every future content
            generation reflects the change immediately. full traceability from
            output back to voice configuration.
          </p>
        </div>

        <hr style={divider} />

        {/* ── The Stack ── */}
        <div style={section}>
          <h2 style={sectionTitle}>the stack</h2>

          <p style={{ ...mutedText, marginBottom: '20px' }}>
            the entire system lives in a git repo. every rule is version-controlled. every change is a commit.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {stackItems.map((item) => (
              <div
                key={item.tool}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '16px',
                  padding: '12px 16px',
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                    minWidth: '130px',
                  }}
                >
                  {item.tool}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={divider} />

        {/* ── What This Produces ── */}
        <div style={section}>
          <h2 style={sectionTitle}>what this produces</h2>

          <p style={paragraph}>
            one voice. six platforms. twelve content pillars. a recursive
            feedback loop that makes every post easier than the last. the
            voice system has grown from 10 lines to 500+ across 4 tiers of
            files. each rule was earned by catching a specific failure in
            real content.
          </p>

          <div style={monoBlock}>
            {'voice DNA files ............. 4\n'}
            {'context playbooks ........... 7\n'}
            {'content ops files ........... 5\n'}
            {'content pillars ............. 12\n'}
            {'anti-slop patterns .......... 14+\n'}
            {'hook styles ................. 6\n'}
            {'platforms covered ........... 6\n'}
            {'the whole system ............ 1 git repo'}
          </div>
        </div>

        <hr style={divider} />

        {/* ── The Principle ── */}
        <div style={section}>
          <div
            style={{
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--accent)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '12px',
              }}
            >
              voice rules are not prompts you paste into ChatGPT.
              <br />
              they are versioned documents that evolve over time.
            </p>
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              prompts are single-use. they live in a chat window and disappear.
              a content operating system lives in a repo, is loaded by agent
              skills, and can be diffed to see how your voice has changed.
              the system describes itself. this page is proof.
            </p>
          </div>
        </div>

        <hr style={divider} />

        {/* ── CTA section ── */}
        <div style={section}>
          <h2 style={sectionTitle}>explore the system</h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {[
              {
                href: '/content-wiki',
                label: 'content wiki',
                desc: 'platform playbooks, voice systems, AI slop avoidance, content workflows',
              },
              {
                href: '/how-to',
                label: 'how-to guides',
                desc: 'step-by-step guides for building your own content operating system',
              },
              {
                href: '/react-lab',
                label: 'react lab',
                desc: 'interactive demos and component experiments',
              },
              {
                href: '/log',
                label: 'the log',
                desc: 'daily output from the system in action',
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--canvas-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s ease',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label} &rarr;
                </span>
                <span
                  style={{ fontSize: '12px', color: 'var(--text-muted)' }}
                >
                  {link.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom nav ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            &larr; Home
          </Link>
          <Link
            href="/content-wiki"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            Content Wiki &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
