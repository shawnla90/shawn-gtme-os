import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const SITE_URL = 'https://thegtmos.ai'

export const metadata: Metadata = {
  title: 'MCP Stack - Model Context Protocol for GTM',
  description:
    'How theGTMOS.ai uses Model Context Protocol servers, parallel agents, and automation crons to power AI-native go-to-market operations.',
  keywords: [
    'Model Context Protocol',
    'MCP servers',
    'MCP for GTM',
    'AI agent automation',
    'GTM automation stack',
    'parallel AI agents',
    'MCP Exa search',
    'MCP Playwright',
    'AI-native GTM',
    'go-to-market automation',
    'agent orchestration',
  ],
  alternates: { canonical: `${SITE_URL}/mcp` },
  openGraph: {
    title: 'The MCP Stack | theGTMOS.ai',
    description:
      'Model Context Protocol servers, parallel agents, and automation crons powering AI-native GTM.',
    url: `${SITE_URL}/mcp`,
  },
}

/* ── data ──────────────────────────────────────────── */

interface MCPServer {
  name: string
  description: string
  useCases: string[]
  status: 'ACTIVE' | 'IN DEV'
}

const MCP_SERVERS: MCPServer[] = [
  {
    name: 'Exa',
    description:
      'Web search, company research, and code context. Powers prospect intelligence, competitive analysis, and real-time market data.',
    useCases: [
      'Company research enrichment',
      'Technical documentation lookup',
      'Market trend analysis',
    ],
    status: 'ACTIVE',
  },
  {
    name: 'Playwright',
    description:
      'Browser automation and visual QA. Headless browser control for testing, screenshots, and form interactions.',
    useCases: [
      'Landing page visual QA',
      'Automated screenshot generation',
      'Form testing and validation',
    ],
    status: 'ACTIVE',
  },
  {
    name: 'Filesystem',
    description:
      'Direct file system access for reading, writing, and managing project files. Powers content generation and data pipeline outputs.',
    useCases: [
      'Blog post generation to disk',
      'SEO data file management',
      'Configuration updates',
    ],
    status: 'ACTIVE',
  },
  {
    name: 'GitHub',
    description:
      'Repository management, PR creation, issue tracking, and code review automation via GitHub CLI integration.',
    useCases: [
      'Automated PR creation',
      'Issue triage and labeling',
      'Code review assistance',
    ],
    status: 'ACTIVE',
  },
  {
    name: 'Custom Toolchain',
    description:
      'Specialized tools built for GTM workflows - Clay enrichment connectors, CRM sync utilities, and email infrastructure management.',
    useCases: [
      'Clay table automation',
      'HubSpot data sync',
      'Sending infrastructure audits',
    ],
    status: 'IN DEV',
  },
]

interface AgentPattern {
  name: string
  description: string
  tools: string[]
}

const AGENT_PATTERNS: AgentPattern[] = [
  {
    name: 'Research Agents',
    description:
      'Exa web search + company intelligence. Parallel research across multiple prospects, competitors, or market segments.',
    tools: ['Exa', 'Filesystem'],
  },
  {
    name: 'QA Agents',
    description:
      'Playwright browser automation. Visual testing, screenshot capture, and cross-page validation.',
    tools: ['Playwright', 'Filesystem'],
  },
  {
    name: 'Content Agents',
    description:
      'Blog generation, SEO optimization, and content pipeline management. Combines research with writing.',
    tools: ['Exa', 'Filesystem', 'GitHub'],
  },
]

interface CronEntry {
  schedule: string
  command: string
  comment: string
  status: string
}

const CRON_ENTRIES: CronEntry[] = [
  {
    schedule: '0 6 * * *',
    command: 'python3 nio_blog_generator.py',
    comment: 'Daily blog generation',
    status: 'ACTIVE',
  },
  {
    schedule: '0 7 * * *',
    command: 'python3 seo_keyword_pipeline.py',
    comment: 'SEO keyword pipeline',
    status: 'ACTIVE',
  },
  {
    schedule: '0 8 * * *',
    command: 'python3 daily_tracker_scan.py',
    comment: 'Daily tracker scan',
    status: 'ACTIVE',
  },
  {
    schedule: '0 9 * * 1',
    command: 'rebuild-content-index',
    comment: 'Content index rebuild',
    status: 'WEEKLY',
  },
]

interface FlowStep {
  name: string
  subtitle: string
}

const FLOW_STEPS: FlowStep[] = [
  { name: 'Clay Enrichment', subtitle: 'Contacts' },
  { name: 'Exa Research', subtitle: 'Intel Data' },
  { name: 'Claude Analysis', subtitle: 'Scored Leads' },
  { name: 'Instantly Outreach', subtitle: 'Email Sends' },
  { name: 'HubSpot CRM', subtitle: 'Pipeline' },
]

/* ── styles ─────────────────────────────────────────── */

const pageWrap: React.CSSProperties = {
  maxWidth: 1080,
  margin: '0 auto',
  padding: '40px 20px 80px',
  fontFamily: 'var(--font-mono)',
}

const terminalPrompt: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: 8,
}

const heroTitle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  lineHeight: 1.2,
  marginBottom: 16,
}

const heroDesc: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: 32,
  maxWidth: 720,
}

const statsRow: React.CSSProperties = {
  display: 'flex',
  gap: 32,
  marginBottom: 0,
  flexWrap: 'wrap',
}

const statBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

const statNum: React.CSSProperties = {
  fontSize: '28px',
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
  margin: '48px 0',
}

const sectionPrompt: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: 8,
}

const sectionTitle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: 8,
}

const sectionDesc: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.7,
  color: 'var(--text-secondary)',
  marginBottom: 24,
  maxWidth: 720,
}

const serverGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))',
  gap: 16,
}

const card: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: 24,
}

const cardHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
}

const cardName: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--text-primary)',
}

const cardDesc: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  marginBottom: 16,
}

const useCaseList: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const useCaseItem: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  paddingLeft: 14,
  position: 'relative',
}

const statusBadge = (status: 'ACTIVE' | 'IN DEV'): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '10px',
  fontWeight: 600,
  color: status === 'ACTIVE' ? '#4ade80' : '#facc15',
  letterSpacing: '0.06em',
})

const statusDot = (status: 'ACTIVE' | 'IN DEV'): React.CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: status === 'ACTIVE' ? '#4ade80' : '#facc15',
  flexShrink: 0,
})

const agentGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 16,
  marginBottom: 32,
}

const toolTag: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '10px',
  fontWeight: 600,
  color: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: 4,
  padding: '2px 8px',
  letterSpacing: '0.04em',
}

const codeBlock: React.CSSProperties = {
  background: 'var(--canvas)',
  border: '1px solid var(--canvas-border)',
  borderRadius: 8,
  padding: 24,
  overflowX: 'auto',
  fontSize: '13px',
  lineHeight: 1.7,
  fontFamily: 'var(--font-mono)',
}

const codeLine: React.CSSProperties = {
  color: 'var(--text-primary)',
  whiteSpace: 'pre',
  display: 'block',
}

const codeComment: React.CSSProperties = {
  color: '#8b949e',
}

const codeAccent: React.CSSProperties = {
  color: 'var(--accent)',
}

const codeGreen: React.CSSProperties = {
  color: '#4ade80',
}

const codeYellow: React.CSSProperties = {
  color: '#facc15',
}

const codeMuted: React.CSSProperties = {
  color: '#8b949e',
}

const flowContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 0,
  overflowX: 'auto',
  paddingBottom: 12,
}

const flowBox: React.CSSProperties = {
  flex: '0 0 auto',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  padding: '16px 20px',
  textAlign: 'center',
  minWidth: 140,
}

const flowBoxName: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: 4,
}

const flowBoxSub: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-muted)',
}

const flowArrow: React.CSSProperties = {
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  padding: '0 8px',
  fontSize: '18px',
  color: 'var(--accent)',
  fontWeight: 700,
  alignSelf: 'center',
}

const navRow: React.CSSProperties = {
  marginTop: 48,
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: 12,
}

const navLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

/* ── page component (server) ───────────────────────── */

export default function MCPPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'MCP Stack', url: `${SITE_URL}/mcp` }]} />

      <div style={pageWrap}>
        {/* ── Section 1: Hero ── */}
        <div style={terminalPrompt}>
          <span style={{ color: 'var(--accent)' }}>$</span> cd ~/gtm-os/mcp/
        </div>
        <h1 style={heroTitle}>The MCP Stack</h1>
        <p style={heroDesc}>
          Model Context Protocol is how AI agents connect to tools, data sources, and APIs.
          This is the MCP infrastructure powering theGTMOS.ai - from web research to browser
          automation to content generation.
        </p>

        <div style={statsRow}>
          <div style={statBox}>
            <span style={statNum}>5</span>
            <span style={statLabel}>MCP Servers</span>
          </div>
          <div style={statBox}>
            <span style={statNum}>3</span>
            <span style={statLabel}>Agent Types</span>
          </div>
          <div style={statBox}>
            <span style={statNum}>4</span>
            <span style={statLabel}>Cron Jobs</span>
          </div>
        </div>

        <hr style={divider} />

        {/* ── Section 2: Configured Servers ── */}
        <div style={sectionPrompt}>
          <span style={{ color: 'var(--accent)' }}>$</span> ls ~/mcp/servers/
        </div>
        <h2 style={sectionTitle}>Configured Servers</h2>

        <div style={serverGrid}>
          {MCP_SERVERS.map((server) => (
            <div key={server.name} style={card}>
              <div style={cardHeader}>
                <span style={cardName}>{server.name}</span>
                <span style={statusBadge(server.status)}>
                  <span style={statusDot(server.status)} />
                  {server.status}
                </span>
              </div>
              <p style={cardDesc}>{server.description}</p>
              <ul style={useCaseList}>
                {server.useCases.map((uc) => (
                  <li key={uc} style={useCaseItem}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--accent)',
                        fontWeight: 700,
                      }}
                    >
                      &rsaquo;
                    </span>
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr style={divider} />

        {/* ── Section 3: Agent Patterns ── */}
        <div style={sectionPrompt}>
          <span style={{ color: 'var(--accent)' }}>$</span> ls ~/mcp/agents/
        </div>
        <h2 style={sectionTitle}>Agent Patterns</h2>
        <p style={sectionDesc}>
          Parallel agents handle complex multi-step tasks. Each agent type specializes in a
          domain and has access to specific MCP servers.
        </p>

        <div style={agentGrid}>
          {AGENT_PATTERNS.map((agent) => (
            <div key={agent.name} style={card}>
              <div style={{ ...cardName, marginBottom: 10 }}>{agent.name}</div>
              <p style={cardDesc}>{agent.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {agent.tools.map((tool) => (
                  <span key={tool} style={toolTag}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={codeBlock}>
          <span style={codeLine}>
            <span style={codeAccent}>$</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>agent-dispatch --parallel</span>
          </span>
          <span style={codeLine}>
            <span style={codeMuted}>{'|-- '}</span>
            <span style={codeGreen}>research-agent</span>
            {'  '}
            <span style={codeMuted}>{'->'}</span>
            {'  Exa.company_research("clay.com")'}
          </span>
          <span style={codeLine}>
            <span style={codeMuted}>{'|-- '}</span>
            <span style={codeGreen}>research-agent</span>
            {'  '}
            <span style={codeMuted}>{'->'}</span>
            {'  Exa.web_search("GTM automation 2026")'}
          </span>
          <span style={codeLine}>
            <span style={codeMuted}>{'|-- '}</span>
            <span style={codeYellow}>qa-agent</span>
            {'        '}
            <span style={codeMuted}>{'->'}</span>
            {'  Playwright.screenshot("/features")'}
          </span>
          <span style={codeLine}>
            <span style={codeMuted}>{'`-- '}</span>
            <span style={{ color: '#60a5fa' }}>content-agent</span>
            {'   '}
            <span style={codeMuted}>{'->'}</span>
            {'  Generate blog draft from research'}
          </span>
          <span style={{ ...codeLine, marginTop: 8 }}>
            <span style={codeComment}>
              [4 agents] [parallel] [avg 12s completion]
            </span>
          </span>
        </div>

        <hr style={divider} />

        {/* ── Section 4: Automation Crons ── */}
        <div style={sectionPrompt}>
          <span style={{ color: 'var(--accent)' }}>$</span> crontab -l
        </div>
        <h2 style={sectionTitle}>Always-On Automation</h2>
        <p style={sectionDesc}>
          Background processes that run daily via launchd. No manual intervention required.
        </p>

        <div style={codeBlock}>
          {CRON_ENTRIES.map((entry, i) => (
            <div key={i}>
              <span style={codeLine}>
                <span style={codeComment}># {entry.comment}</span>
              </span>
              <span style={{ ...codeLine, marginBottom: i < CRON_ENTRIES.length - 1 ? 12 : 0 }}>
                <span style={codeMuted}>{entry.schedule}</span>
                {'  '}
                <span style={{ color: 'var(--text-primary)' }}>{entry.command}</span>
                {'      '}
                <span style={codeComment}># STATUS: </span>
                <span
                  style={
                    entry.status === 'ACTIVE' || entry.status === 'WEEKLY'
                      ? codeGreen
                      : codeYellow
                  }
                >
                  {entry.status}
                </span>
              </span>
            </div>
          ))}
        </div>

        <hr style={divider} />

        {/* ── Section 5: Integration Map ── */}
        <div style={sectionPrompt}>
          <span style={{ color: 'var(--accent)' }}>$</span> cat ~/mcp/integration-map.txt
        </div>
        <h2 style={sectionTitle}>The GTM Data Flow</h2>
        <p style={sectionDesc}>
          How MCP connects the entire GTM stack - from data enrichment to outreach.
        </p>

        <div style={flowContainer}>
          {FLOW_STEPS.map((step, i) => (
            <div key={step.name} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={flowBox}>
                <div style={flowBoxName}>{step.name}</div>
                <div style={flowBoxSub}>{step.subtitle}</div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div style={flowArrow}>&rarr;</div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={navRow}>
          <Link href="/" style={navLink}>
            &larr; home
          </Link>
          <Link href="/vitals" style={navLink}>
            system vitals &rarr;
          </Link>
        </div>
      </div>
    </>
  )
}
