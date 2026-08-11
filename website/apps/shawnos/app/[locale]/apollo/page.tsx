import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'

const REPO_URL = 'https://github.com/shawnla90/apollo-webinar-demo'
const REFERRAL_URL =
  'https://www.apollo.io/anywhere?utm_campaign=parent_apolloanywhere&utm_medium=referral&utm_source=shawn_tenam&utm_content=influencer'
const WEBINAR_URL = 'https://events.apollo.io/builder-gtm-guide/'

export async function generateMetadata(): Promise<Metadata> {
  const title = "Builder's Guide to GTM with Apollo | shawnos.ai"
  const description =
    'Three paths for the technical GTM builder — API, CLI, and MCP. A real campaign, open-source scoring, and a cloneable repo.'
  return {
    title,
    description,
    keywords: [
      'Apollo API',
      'GTM engineer',
      'Apollo CLI',
      'sales automation',
      'buying committee',
      'go-to-market',
      'Apollo MCP',
    ],
    alternates: {
      canonical: 'https://shawnos.ai/apollo',
      languages: hreflang('/apollo'),
    },
    openGraph: {
      title,
      description,
      url: 'https://shawnos.ai/apollo',
      images: [
        {
          url: '/og?title=Builder%27s+Guide+to+GTM&subtitle=API+%C2%B7+CLI+%C2%B7+MCP',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: ['/og?title=Builder%27s+Guide+to+GTM&subtitle=API+%C2%B7+CLI+%C2%B7+MCP'],
    },
  }
}

type Props = {
  params: Promise<{ locale: string }>
}

const PATHS = [
  {
    label: 'API',
    dir: 'api/',
    who: 'Developers building custom pipelines',
    desc: 'Python scripts for batch processing, custom scoring, database integrations. Full control over every parameter.',
    scripts: [
      'expand_buying_committee.py — companies to ranked committees',
      'enterprise_filter.py — the BlackRock problem',
      'lib/apollo_client.py — clean wrapper with rate limiting',
    ],
  },
  {
    label: 'CLI',
    dir: 'cli/',
    who: 'Technical builders who live in the terminal',
    desc: 'Shell scripts using Apollo CLI + jq. Composable, pipe-native, cron-ready.',
    scripts: [
      'expand_committee.sh — expansion play, shell-native',
      'campaign_rerun.sh — rebuild a campaign in shell',
      'company_intel.sh — enrichment + news + jobs',
    ],
  },
  {
    label: 'MCP',
    dir: 'cowork/',
    who: 'Reps and non-technical team members',
    desc: 'Connect Apollo MCP to Claude. Anyone prospects via chat — no code, no training.',
    scripts: [
      'setup-guide.md — 5-minute connection guide',
      'example-prompts.md — ready-to-use prompts',
    ],
  },
]

const COST_TABLE = [
  { endpoint: 'mixed_people/api_search', cost: 'Free', returns: 'Names, titles, email_status flags, has_phone flags' },
  { endpoint: 'organizations/enrich', cost: 'Free', returns: 'Company info: employees, funding, tech stack' },
  { endpoint: 'Email reveal', cost: '1 credit', returns: 'Actual email address' },
  { endpoint: 'Mobile reveal', cost: 'Mobile credit', returns: 'Direct-dial phone number' },
]

const SCORING = [
  { keyword: 'RevOps / Revenue Operations', weight: 100 },
  { keyword: 'Revenue', weight: 90 },
  { keyword: 'Growth', weight: 80 },
  { keyword: 'GTM / Go-To-Market', weight: 75 },
  { keyword: 'Sales', weight: 60 },
  { keyword: 'Marketing', weight: 55 },
  { keyword: 'Product', weight: 50 },
]

const SENIORITY = [
  { level: 'C-suite', bonus: '+30' },
  { level: 'VP', bonus: '+25' },
  { level: 'Head of', bonus: '+20' },
  { level: 'Director', bonus: '+15' },
]

export default async function ApolloPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const kicker: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  }

  const h2: React.CSSProperties = {
    fontSize: 'clamp(24px, 3vw, 32px)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: 'var(--text-primary)',
    margin: '0 0 14px',
  }

  const h3: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: '0 0 8px',
  }

  const body: React.CSSProperties = {
    fontSize: 15,
    lineHeight: 1.65,
    color: 'var(--text-secondary)',
    margin: '0 0 16px',
  }

  const card: React.CSSProperties = {
    padding: 24,
    background: 'var(--canvas-subtle)',
    border: '1px solid var(--canvas-border)',
    borderRadius: 'var(--radius-lg)',
  }

  const section: React.CSSProperties = {
    padding: '0 24px 56px',
    maxWidth: 760,
    margin: '0 auto',
  }

  const code: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.6,
    padding: '16px 20px',
    background: 'var(--canvas-subtle)',
    border: '1px solid var(--canvas-border)',
    borderRadius: 'var(--radius-md)',
    overflowX: 'auto',
    whiteSpace: 'pre',
    display: 'block',
    margin: '0 0 16px',
    color: 'var(--text-primary)',
  }

  const inlineCode: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    padding: '2px 6px',
    background: 'var(--canvas-subtle)',
    borderRadius: 4,
    color: 'var(--text-primary)',
  }

  const tableCell: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: 14,
    borderBottom: '1px solid var(--canvas-border)',
    color: 'var(--text-secondary)',
  }

  const tableHeader: React.CSSProperties = {
    ...tableCell,
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontSize: 12,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  }

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: "Builder's Guide to GTM with Apollo", url: 'https://shawnos.ai/apollo' }]}
      />

      {/* Hero */}
      <section className="full-bleed" style={{ padding: '72px 24px 20px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ ...kicker, marginBottom: 14 }}>apollo webinar · aug 13 2026</div>
          <h1
            style={{
              fontSize: 'clamp(38px, 6vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: 'var(--text-primary)',
              margin: '0 0 18px',
            }}
          >
            Builder&rsquo;s Guide to GTM with Apollo
          </h1>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.55,
              color: 'var(--text-secondary)',
              margin: '0 0 24px',
              maxWidth: 620,
            }}
          >
            Three paths for the technical GTM builder — API for full control,
            CLI for speed, MCP for your whole team. Built around a real campaign
            with 1,297 contacts, open-source scoring, and a cloneable repo.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 22px',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--text-primary)',
                color: 'var(--canvas-base, #fff)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              clone the repo →
            </a>
            <a
              href={REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 22px',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--canvas-border)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              get Apollo Anywhere
            </a>
          </div>
        </div>
      </section>

      {/* The Campaign */}
      <section style={{ ...section, paddingTop: 40 }}>
        <h2 style={h2}>The campaign behind this</h2>
        <p style={body}>
          This repo was built around a real outreach campaign. 1,297 GTM
          engineers sourced from Apollo, segmented into three personas: SaaS
          operators (850), agency builders (289), and AEO marketers (158).
          Launched via Smartlead across 44 sending boxes.
        </p>
        <p style={body}>
          14% bounce rate on launch. Diagnosed as 45% stale mailboxes plus 55%
          fresh-box reputation issues. Fixed by filtering to verified emails
          only — no catch-all domains. 223 LinkedIn connections accepted via
          HeyReach.
        </p>
        <p style={{ ...body, margin: 0 }}>
          The expansion play takes those 223 companies where we have a
          relationship and finds the full buying committee at each. That is
          what the demo shows.
        </p>
      </section>

      {/* Three Paths Diagram */}
      <section style={section}>
        <h2 style={h2}>Three paths, same data</h2>
        <div style={{ marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/apollo/three-paths-diagram.svg"
            alt="Three paths diagram: API, CLI, and MCP all connect to the same Apollo data layer"
            style={{
              width: '100%',
              maxWidth: 700,
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--canvas-border)',
            }}
          />
        </div>
        <div style={{ display: 'grid', gap: 20 }}>
          {PATHS.map((p) => (
            <div key={p.label} style={card}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <span style={h3}>{p.label}</span>
                <span style={{ ...inlineCode, fontSize: 12 }}>{p.dir}</span>
              </div>
              <p style={{ ...body, fontSize: 13, color: 'var(--text-muted)', margin: '0 0 6px' }}>
                {p.who}
              </p>
              <p style={{ ...body, fontSize: 14, margin: '0 0 12px' }}>{p.desc}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
                {p.scripts.map((s) => (
                  <li
                    key={s}
                    style={{
                      fontSize: 13,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-secondary)',
                      paddingLeft: 14,
                      borderLeft: '2px solid var(--canvas-border)',
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Expansion Play */}
      <section style={section}>
        <h2 style={h2}>The expansion play</h2>
        <p style={body}>
          You have one contact at a company. The expansion play finds the full
          buying committee — scored by title relevance and reachability.
        </p>
        <code style={code}>
{`# Single company
python3 api/expand_buying_committee.py --domains mixpanel.com

# Batch with Google Sheet output
python3 api/expand_buying_committee.py \\
  --file data/sample_domains.txt \\
  --sheet "My Expansion"

# CLI equivalent
./cli/expand_committee.sh --domain mixpanel.com --top 5`}
        </code>

        <h3 style={{ ...h3, marginTop: 24 }}>Scoring system</h3>
        <p style={body}>
          Each contact gets a composite score: title relevance (additive
          keywords) multiplied by a reachability tier. A VP of Revenue
          Operations with verified email and phone scores (100 + 90 + 25)
          &times; 1.0 = 215.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ ...kicker, marginBottom: 8 }}>title keywords</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {SCORING.map((s) => (
                    <tr key={s.keyword}>
                      <td style={{ ...tableCell, fontSize: 13 }}>{s.keyword}</td>
                      <td style={{ ...tableCell, fontSize: 13, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                        {s.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div style={{ ...kicker, marginBottom: 8 }}>seniority bonus</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {SENIORITY.map((s) => (
                    <tr key={s.level}>
                      <td style={{ ...tableCell, fontSize: 13 }}>{s.level}</td>
                      <td style={{ ...tableCell, fontSize: 13, fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                        {s.bonus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* API Cost Breakdown */}
      <section style={section}>
        <h2 style={h2}>What costs credits (and what does not)</h2>
        <p style={body}>
          The expansion play scores contacts using free availability flags. It
          never reveals actual emails or phone numbers. You build the full
          prioritized list without spending credits, then only reveal the
          winners.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr>
                <th style={{ ...tableHeader, textAlign: 'left' }}>Endpoint</th>
                <th style={{ ...tableHeader, textAlign: 'left' }}>Cost</th>
                <th style={{ ...tableHeader, textAlign: 'left' }}>What you get</th>
              </tr>
            </thead>
            <tbody>
              {COST_TABLE.map((row) => (
                <tr key={row.endpoint}>
                  <td style={{ ...tableCell, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    {row.endpoint}
                  </td>
                  <td
                    style={{
                      ...tableCell,
                      fontWeight: 700,
                      color: row.cost === 'Free' ? 'var(--aura)' : 'var(--text-primary)',
                    }}
                  >
                    {row.cost}
                  </td>
                  <td style={tableCell}>{row.returns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ ...card, padding: 20 }}>
          <p style={{ ...body, margin: 0, fontSize: 14, fontStyle: 'italic' }}>
            Build a ranked list of 100+ contacts using free searches. Pick the
            top 20 by composite score. Only reveal those 20. That is 20 credits
            instead of 100+.
          </p>
        </div>
      </section>

      {/* Protect Your API Key */}
      <section style={section}>
        <h2 style={h2}>Protect your API key</h2>
        <p style={body}>
          If you are building a repo for your team or sharing code publicly,
          your API key should never appear in git history.
        </p>
        <code style={code}>
{`.env          # your real key (gitignored, never committed)
.env.example  # template with placeholders (committed)
.gitignore    # blocks .env from being tracked`}
        </code>
        <p style={body}>
          The API client reads from the environment. The test: run{' '}
          <span style={inlineCode}>git log --all -p | grep APOLLO</span> on
          your repo. If it returns anything, your key leaked.
        </p>
      </section>

      {/* CTA */}
      <section style={{ ...section, paddingBottom: 96 }}>
        <div style={{ ...card, padding: 32 }}>
          <div style={{ ...kicker, marginBottom: 12 }}>get started</div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              marginBottom: 10,
            }}
          >
            Clone, configure, run
          </div>
          <p style={{ ...body, fontSize: 14 }}>
            The repo has everything — API scripts, CLI tools, MCP setup guide,
            sample data, and a scoring system you can customize for your ICP.
            Set your Apollo API key and run the expansion play in under 5
            minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 22px',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--text-primary)',
                color: 'var(--canvas-base, #fff)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              clone the repo →
            </a>
            <a
              href={REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '12px 22px',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--canvas-border)',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              get Apollo Anywhere
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
