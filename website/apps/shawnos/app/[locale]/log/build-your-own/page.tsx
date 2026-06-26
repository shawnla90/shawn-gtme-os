import type { Metadata } from 'next'
import { hreflang } from '../../../../i18n/hreflang'
import { Link } from '../../../../i18n/navigation'
import { getTranslations } from 'next-intl/server'
import CopyButton from './CopyButton'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { PageHero, ScrollRevealSection } from '../LogReveal'

/* ── Metadata & SEO ── */

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Log.buildYourOwn')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: [
      'how to build your own AI model',
      'build your own AI model',
      'personal AI assistant',
      'free build your own AI girlfriend',
      'build your own AI girlfriend',
      'personalized AI companion',
      'custom AI assistant free',
      'free build your own AI girl',
      'build your own AI girl',
      'custom AI assistant',
      'personal AI companion',
      'daily tracker',
      'AI workflow',
      'build in public',
      'Cursor IDE',
      'Claude prompt',
      'daily output',
      'developer dashboard',
      'Pillow dashboard',
    ],
    alternates: { canonical: 'https://shawnos.ai/log/build-your-own', languages: hreflang('/log/build-your-own') },
    openGraph: {
      title: `${t('metadata.title')} | shawnos.ai`,
      description: t('metadata.description'),
      url: 'https://shawnos.ai/log/build-your-own',
      images: [
        {
          url: '/og?title=Build+Your+Own+Tracker&subtitle=The+prompt+behind+the+daily+receipts',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      title: `${t('metadata.title')} | shawnos.ai`,
      description: t('metadata.description'),
      images: [
        '/og?title=Build+Your+Own+Tracker&subtitle=The+prompt+behind+the+daily+receipts',
      ],
    },
  }
}

/* ── The self-contained prompt ── */

const TRACKER_PROMPT = `# Daily Activity Tracker: Build Your Own

You are a daily output tracker. Every evening (~8 PM), scan the user's work from the current calendar day (00:00–23:59) and generate a structured JSON log + a visual Pillow dashboard image.

## What You Track

Scan these sources for accomplishments:

1. **Git commits**: files added or modified in today's commits
2. **Untracked files**: new files with today's date in the filename (e.g., \`2026-02-14_slug.md\`)
3. **File modification time (mtime)**: walk key directories and find ANY file modified today, regardless of filename pattern. This is critical for work that doesn't have date-prefixed filenames.
4. **Content pipeline**: walk \`content/*/drafts/\` and \`content/*/final/\` for current state

### Directories to Scan by mtime

Customize these to match your repo structure:

- \`content/\`: drafts and finals
- \`scripts/\`: Python/shell scripts
- \`workflows/\`: workflow docs
- \`.cursor/skills/\`: Cursor agent skills
- \`.cursor/rules/\`: Cursor rules

### Classification Rules

Map file paths to type codes:

| Path Pattern | Type Code | Category |
|---|---|---|
| \`content/{platform}/final/*.md\` | \`{platform}_final\` | Content |
| \`content/{platform}/drafts/*.md\` | \`{platform}_draft\` | Content |
| \`.cursor/skills/*/SKILL.md\` | \`skill_updated\` | Skills & System |
| \`.cursor/rules/*.md\` | \`cursor_rule\` | Skills & System |
| \`workflows/*.md\` | \`workflow_updated\` | Skills & System |
| \`scripts/*.py\` | \`script\` | Scripts |

For each accomplishment, record:
- **timestamp**: file's last-modified time as HH:MM
- **words**: word count (strip YAML frontmatter first)
- **source**: \`"auto"\` (git/date-match), \`"auto-mtime"\` (modification time), or \`"manual"\`

## Scoring System

### Point Weights

| Item Type | Points |
|---|---|
| Monorepo / project scaffold (\`monorepo_build\` / \`project_scaffold\`) | 50 |
| Feature system — RPG, dashboard, complex feature (\`feature_system\`) | 30 |
| Landing page / full page build (\`landing_page\` / \`full_page_build\`) | 25 |
| Code infrastructure — scripts, config, CI/CD (\`code_infra\`) | 15 |
| Finalized content (\`*_final\`) | 10 |
| New skill or workflow | 5 |
| Manual accomplishment | 5 |
| Cursor rule | 3 |
| Draft content (\`*_draft\`) | 2 |
| Script | 2 |

### Letter Grades

| Score | Grade |
|---|---|
| > 500 | S+ |
| 350–500 | S |
| 150–299 | A+ |
| 50–149 | A |
| 15–49 | B |
| 5–14 | C |
| < 5 | D |

### Computed Metrics

- **Output Score** = sum of weighted points from all accomplishments
- **Efficiency Rating** = Output Score / Total Token Cost (pts/$: higher is better)

## Token Usage Tracking

### Auto-detect Claude Code sessions
Parse \`~/.claude/projects/<project-slug>/*.jsonl\` for today's messages with \`usage\` data. Aggregate per session: input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens, model.

### Cursor session estimation
Since Cursor doesn't expose token data on disk, estimate based on conversation length:
- Short session (~5 exchanges): ~5K input / ~2K output
- Medium session (~15 exchanges): ~20K input / ~8K output
- Large session (~30+ exchanges): ~50K+ input / ~20K+ output

### Token pricing (per million tokens, cache-aware)

| Model | Input | Output | Cache Read | Cache Write |
|---|---|---|---|---|
| opus | $15.00 | $75.00 | $1.50 | $18.75 |
| sonnet | $3.00 | $15.00 | $0.30 | $3.75 |
| haiku | $0.25 | $1.25 | $0.025 | $0.3125 |

## JSON Schema

\`\`\`json
{
  "date": "YYYY-MM-DD",
  "generated_at": "ISO-8601",
  "version": 3,
  "accomplishments": [
    {
      "type": "substack_final",
      "title": "post title",
      "path": "content/substack/final/2026-02-14_post.md",
      "source": "auto",
      "timestamp": "09:14",
      "words": 1240,
      "value_score": 10,
      "shipped": true
    }
  ],
  "pipeline": {
    "drafts_active": [
      {
        "platform": "substack",
        "title": "draft title",
        "path": "content/substack/drafts/2026-02-14_draft.md",
        "target_date": "2026-02-14",
        "words": 890
      }
    ],
    "finalized_today": []
  },
  "todos": [],
  "token_usage": [
    {
      "input_tokens": 155,
      "output_tokens": 743,
      "cache_read_tokens": 0,
      "cache_write_tokens": 0,
      "model": "sonnet",
      "source": "claude-code",
      "logged_at": "21:05",
      "cost": 0.05
    }
  ],
  "stats": {
    "platform_breakdown": { "substack": 2, "linkedin": 1, "other": 3 },
    "words_today": 4200,
    "pipeline_words": 18500,
    "finals_count": 1,
    "first_activity": "09:14",
    "last_activity": "17:45",
    "output_score": 34,
    "letter_grade": "A",
    "score_breakdown": [
      { "type": "substack_final", "title": "post title", "points": 10 }
    ],
    "efficiency_rating": 2.6,
    "shipped_count": 8,
    "draft_count": 3,
    "ship_rate": 0.73
  },
  "git_summary": {
    "commits_today": 3,
    "files_added": [],
    "files_modified": [],
    "lines_added_count": 0,
    "lines_removed_count": 0,
    "lines_net": 0
  }
}
\`\`\`

## Dashboard Image (Pillow)

Generate a PNG dashboard card using Python + Pillow with this layout:

### Design System
- **Background**: \`(12, 13, 17)\`, near-black
- **Panel fill**: \`(22, 24, 30)\`, dark gray
- **Border**: \`(40, 44, 54)\`
- **Green accent**: \`(78, 195, 115)\`
- **Text**: \`(185, 195, 210)\`
- **Bright text**: \`(230, 236, 245)\`
- **Muted**: \`(100, 110, 128)\`
- **Amber**: \`(220, 170, 60)\`
- **Cyan**: \`(80, 190, 220)\`
- **Purple**: \`(160, 120, 220)\`
- **Canvas**: 1400x960px
- **Font**: Menlo (monospace, pre-installed on macOS)

### Layout Structure
1. **Header row**: "DAILY TRACKER" in green + letter grade badge (colored pill) + date right-aligned
2. **Stat boxes row**: small cards: shipped count, finalized, pending TODOs, pipeline count, words today, commits, files touched, tokens, est. cost
3. **Platform breakdown bar**: e.g., \`LI:3  SUB:2  X:1\` with per-platform colors
4. **Three-column panels**:
   - **Left (40%)**: Accomplishments list: timestamp, [type tag], title (word count)
   - **Middle (32%)**: TODOs (high priority first) + Pipeline drafts (sorted by target date)
   - **Right (28%)**: Token usage: sessions, input/output/cache totals, cost, model breakdown, efficiency rating
5. **Footer**: summary stats centered

### Grade Badge Colors
- S+: Orange-Gold \`(255, 107, 53)\`
- S: Gold \`(255, 200, 60)\`
- A+/A: Green \`(78, 195, 115)\`
- B: Cyan \`(80, 190, 220)\`
- C: Amber \`(220, 170, 60)\`
- D: Red \`(180, 70, 70)\`

## Agent Implementation

You need two Python scripts:

### 1. Scanner (\`daily_scan.py\`)
- Scans git, untracked files, mtime, and content pipeline
- Classifies each file into a type code
- Computes scoring (weighted points, letter grade)
- Auto-detects Claude Code token usage from JSONL transcripts
- Merges with existing JSON (preserves manual entries and TODOs)
- Writes \`data/daily-log/YYYY-MM-DD.json\`

### 2. Dashboard (\`daily_dashboard.py\`)
- Reads the JSON log
- Renders the Pillow image with the layout above
- Saves as \`data/daily-log/YYYY-MM-DD.png\`

### Agent Tool Selection & Dependencies
- Python 3 (stdlib only for scanner)
- Pillow (\`pip install Pillow\`) for dashboard
- Menlo font (pre-installed on macOS) or any monospace font

## Merge Safety

The scanner **never deletes** manual accomplishments, TODOs, or non-auto token entries:
- Auto-detected accomplishments: refreshed each scan
- Manual accomplishments: preserved forever
- TODOs: preserved forever
- Claude Code tokens: replaced on re-scan (idempotent)
- Cursor estimates: preserved
- Manual tokens: preserved

Safe to run multiple times per day.

## Agent Workflow Commands

| Command | What it does |
|---|---|
| \`/tracker\` | Scan + compute score + generate dashboard image |
| \`/tracker add <desc>\` | Add manual accomplishment |
| \`/tracker todo <task>\` | Add a TODO |
| \`/tracker done <id>\` | Mark TODO complete |
| \`/tracker next\` | Show pending TODOs + pipeline |
| \`/tracker week\` | Show last 7 days summary |
`

/* ── Styles ── */

const container: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '40px 20px 60px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '32px',
}

const heroTitle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '12px',
  lineHeight: 1.3,
}

const heroSub: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  marginBottom: '32px',
}

const calloutBox: React.CSSProperties = {
  padding: '16px 20px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderLeft: '3px solid var(--shawnos-amber, #D2A53C)',
  borderRadius: '6px',
  marginBottom: '32px',
}

const calloutTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--shawnos-amber, #D2A53C)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '8px',
}

const calloutText: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  margin: 0,
}

const sectionLabel: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--accent)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '12px',
}

const promptWrapper: React.CSSProperties = {
  position: 'relative',
  marginBottom: '32px',
}

const promptBlock: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '20px',
  paddingTop: '48px',
  fontSize: '12px',
  lineHeight: 1.7,
  color: 'var(--text-primary)',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  maxHeight: '600px',
  overflowY: 'auto',
  fontFamily: 'var(--font-mono)',
  margin: 0,
}

const backLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

/* ── Page ── */

export default async function BuildYourOwnPage() {
  const t = await getTranslations('Log.buildYourOwn')
  return (
    <>
    <BreadcrumbSchema
      items={[
        { name: 'Log', url: 'https://shawnos.ai/log' },
        { name: t('heroTitle'), url: 'https://shawnos.ai/log/build-your-own' },
      ]}
    />
    <PageHero
      compact
      title={t('heroTitle')}
      subtitle={t('heroSubtitle')}
    />

    <ScrollRevealSection background="var(--canvas)">
      <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '28px' }}>
        This is a hands-on reference for building an AI agent automation system from scratch - the kind that runs locally, costs almost nothing, and replaces hours of manual tracking with a nightly automation pipeline. No SaaS, no vendor lock-in. The agent setup covered here powers the daily receipts on this site: a scanner that reads git history and file mtimes, scores your output, and renders a dashboard card every evening without any human input.
      </p>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.3 }}>
        How to Build Your Own AI Model - Personal AI Assistant Guide
      </h1>
      <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '16px' }}>
        If you want to build your own AI model that tracks daily output - no cloud subscriptions, no SaaS lock-in - this is the starting point. It runs as a personal AI assistant on your own machine: scanning git commits, scoring your work, and generating a dashboard card every evening without any manual input. Free to use, copy-paste ready, and built from the exact stack behind this site.
      </p>
      <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '32px' }}>
        This is the prompt and system behind the daily tracker you see on this site. It scans your work, scores your output, and generates a dashboard card every evening. No subscriptions, no cloud lock-in, just a prompt and a Python script.
      </p>
      <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '20px' }}>
        What follows is a live reference for ai agent orchestration at the individual level — a single developer wiring together scanning, scoring, and rendering into a fully automated nightly pipeline with no manual input required.
      </p>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px', lineHeight: 1.3 }}>
        Day-by-day log of building an AI automation agency from scratch
      </h2>
      <p style={{ ...heroSub, marginBottom: '28px' }}>
        This is a free guide to building your own personal AI assistant - no SaaS subscriptions, no cloud lock-in, just a prompt and a Python script running on your own machine.
        Everything here is open, copy-paste ready, and built from the actual system powering the daily receipts on this site.
        If you want to track your own output the same way, start here.
      </p>

      {/* Claude Code callout */}
      <div style={{ ...calloutBox, borderLeft: '3px solid var(--accent)', marginBottom: '28px' }}>
        <div style={{ ...calloutTitle, color: 'var(--accent)' }}>Building an AI Agent with Claude Code</div>
        <p style={calloutText}>
          This entire stack was built by{' '}
          <Link href="/how-to" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            building an AI agent with Claude Code
          </Link>{' '}
          - using it as the execution layer that writes the scripts, runs the scans, and iterates on the prompt below.{' '}
          If you want the guided version, the{' '}
          <Link href="/how-to" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            how-to guides
          </Link>{' '}
          walk through setup step by step, from first prompt to nightly cron.
        </p>
      </div>

      <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '28px' }}>
        The initial scaffolding and daily iteration ran on Claude Sonnet - fast feedback loops, lower cost per session, ideal for the scan-score-render cycle that needed dozens of small refinements. Architecture decisions (scoring weights, the merge safety model, schema versioning) switched to Claude Opus, where the broader reasoning depth paid for itself in fewer wrong turns. The nightly cron job itself runs on Claude Haiku - near-zero cost for structured JSON generation at that scale, no Opus firepower needed.
      </p>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={sectionLabel}>AI Agent Orchestration Setup</h2>
        <p style={heroSub}>
          This page is a resource for setting up free AI agents and automations
          that run on your own machine - no SaaS subscriptions, no vendor lock-in.
          The tracker below is one piece of a larger free automations stack: tools
          wired together to scan, score, and surface your daily output automatically.
          The ai agent behind these daily receipts replaced ~45 minutes of manual
          logging per day - scanning git history, file mtimes, and content directories
          in seconds and rendering a scored dashboard card without any human input.
          If you want to build your own AI agent for developer productivity tracking,
          this is the exact prompt that powers it. Drop it into Cursor, Claude Code,
          or any AI IDE and you have a working agent in minutes.
        </p>
      </div>

      <p style={heroSub}>
        The daily receipts you see on{' '}
        <Link
          href="/log"
          style={{
            color: 'var(--accent)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          the log page
        </Link>{' '}
        are generated by an AI-native tracking system. A scanner that auto-detects
        your daily output from git, file modification times, and content directories,
        then scores it and renders a visual dashboard card. Below is the full prompt
        you can drop into Cursor, Claude, or any AI IDE to build your own.
      </p>

      <div style={calloutBox}>
        <div style={calloutTitle}>Living Document</div>
        <p style={calloutText}>
          This prompt evolves as the tracker evolves. If the receipts change shape,
          gain new metrics, or add new scoring categories. So does this prompt.
          Changes only make it better. Bookmark this page and come back for the
          latest version.
        </p>
      </div>
    </ScrollRevealSection>

    <ScrollRevealSection background="var(--canvas-subtle)">
      <div style={{ marginBottom: '12px' }}>
        <h3 style={sectionLabel}>{t('thePrompt')}</h3>
      </div>

      <div style={promptWrapper}>
        <CopyButton text={TRACKER_PROMPT} />
        <pre style={promptBlock}>{TRACKER_PROMPT}</pre>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: '48px', marginBottom: '32px' }}>
        <h3 style={sectionLabel}>Agent Setup FAQ</h3>
        {[
          {
            q: 'What hardware do I need to build a personal AI assistant?',
            a: 'A Mac Mini M2 (8GB RAM, 256GB SSD) handles this entire stack. The scanner and dashboard scripts are pure Python — no GPU needed. AI calls go to Claude over the network, so local compute is just file I/O and image rendering.',
          },
          {
            q: 'Can I run this on a Mac Mini?',
            a: 'Yes — this was built on a Mac Mini M2 running as an always-on dev server. The tracker fires as a nightly launchd job, scans the repo, and generates the dashboard card without any manual input. Low power, always on, silent.',
          },
          {
            q: 'How much does a personal AI assistant cost to run?',
            a: 'Claude Sonnet runs ~$3/M input and $15/M output tokens. A typical daily tracker session uses under 10K tokens total — roughly $0.05–$0.15/day or $1.50–$4.50/month. The scanner itself uses zero API calls (pure Python). Only dashboard generation hits the model.',
          },
          {
            q: 'Do I need a cloud subscription or SaaS tool?',
            a: 'No. The tracker runs entirely local: git CLI, Python stdlib, and Pillow for image rendering. The only external dependency is an Anthropic API key. No Notion, no Linear, no third-party logging service.',
          },
          {
            q: 'Does this work with Cursor or Claude Code?',
            a: 'Yes. The prompt is model-agnostic — drop it into Cursor Agent, Claude Code, or any tool that takes a system prompt. Claude Code also writes token usage to JSONL transcripts that the scanner reads automatically, so cost tracking works with zero extra setup.',
          },
          {
            q: 'Can I build my own AI girlfriend for free?',
            a: 'Yes, in the sense that the core setup costs nothing upfront. The scanner and dashboard scripts are free, open, and run locally. The only cost is API usage if you use a hosted model like Claude - and at typical usage that runs under $5/month. If you want fully free, you can swap in a local model via Ollama and pay nothing.',
          },
          {
            q: 'What tools do I need to build a personal AI assistant?',
            a: 'The minimum setup is Python 3, Pillow for image rendering, and an Anthropic API key. Optional but useful: git (for tracking commits), Cursor or Claude Code as your AI IDE, and launchd or cron to schedule the nightly scan. No cloud services, no paid SaaS, no database. Everything runs from your local machine.',
          },
          {
            q: 'Is it free to create a custom AI companion?',
            a: 'The code is free. Running it costs whatever your API provider charges for the model calls - typically a few cents per day at normal usage. If you want zero ongoing cost, run a local model instead. The tracker itself (scanning, scoring, dashboard rendering) uses no API calls at all.',
          },
        ].map(({ q, a }) => (
          <details
            key={q}
            style={{ borderBottom: '1px solid var(--border)', padding: '14px 0' }}
          >
            <summary
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {q}
              <span style={{ color: 'var(--accent)', marginLeft: '8px', flexShrink: 0 }}>+</span>
            </summary>
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                marginTop: '10px',
                marginBottom: 0,
              }}
            >
              {a}
            </p>
          </details>
        ))}
      </div>

      <Link href="/log" style={backLink}>
        &larr; {t('backToLog')}
      </Link>
    </ScrollRevealSection>
    </>
  )
}
