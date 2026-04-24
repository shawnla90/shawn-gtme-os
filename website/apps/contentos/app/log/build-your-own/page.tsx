import type { Metadata } from 'next'
import Link from 'next/link'
import CopyButton from './CopyButton'

/* ── Metadata & SEO ── */

export const metadata: Metadata = {
  title: 'Build Your Own AI Assistant: A Personal Airplane Kit Approach',
  description:
    'Build your own AI assistant like assembling an airplane kit - all the components are here, pre-specified, ready to assemble. A free copy-paste prompt that auto-detects your daily output from git, file mtime, and content directories, scores it, and renders a visual dashboard.',
  keywords: [
    'build your own airplane kit',
    'how to build ai assistant for free',
    'build ai assistant',
    'free ai assistant',
    'AI daily tracker',
    'AI workflow',
    'build in public',
    'Cursor IDE',
    'Claude prompt',
    'daily output',
    'developer dashboard',
    'Pillow dashboard',
    'ai agent automation tools',
    'AI agent setup',
  ],
  alternates: { canonical: 'https://thecontentos.ai/log/build-your-own' },
  openGraph: {
    title: 'Build Your Own AI Assistant: A Personal Airplane Kit Approach | thecontentos.ai',
    description:
      'A free AI agent automation stack using Claude, launchd, and Next.js. Build your own airplane kit style - copy-paste prompt that auto-detects output, scores it, and renders a visual dashboard.',
    url: 'https://thecontentos.ai/log/build-your-own',
    images: [
      {
        url: '/og?title=Build+Your+Own+AI+Assistant&subtitle=Free+step-by-step+guide',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Build Your Own AI Assistant: A Personal Airplane Kit Approach | thecontentos.ai',
    description:
      'A free AI agent automation stack using Claude, launchd, and Next.js. Build your own airplane kit style - copy-paste prompt that auto-detects output, scores it, and renders a visual dashboard.',
    images: [
      '/og?title=Build+Your+Own+AI+Assistant&subtitle=Free+step-by-step+guide',
    ],
  },
}

/* ── FAQ schema ── */

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a free AI agent automation tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A free AI agent automation tool is a prompt or script you drop into an AI IDE like Cursor or Claude Code that automates a repeatable workflow without a paid SaaS subscription. This daily tracker is one example — it uses Python stdlib (no paid libraries), reads from git and file system, and only requires an Anthropic API key for the dashboard generation step. The scanner itself makes zero API calls.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I set up an AI agent for free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To set up a free AI agent for daily tracking: (1) Copy the prompt from this page into Cursor, Claude Code, or any AI IDE. (2) Customize the directory list to match your repo structure. (3) Run the generated scanner script each evening — it reads git commits, untracked files, and file modification times to detect your output automatically. (4) Run the dashboard script to render a visual PNG card from the JSON log. No cloud account, no SaaS tool, no GPU required — just Python 3, Pillow, and an Anthropic API key.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does this AI agent daily tracker automate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The daily tracker automates four things: (1) Output detection — it scans git commits, date-prefixed untracked files, and file modification times across your content and script directories so nothing slips through. (2) Scoring — it weights each file type (finalized content = 10pts, new skills = 5pts, drafts = 2pts) and computes a letter grade from S down to D. (3) Token cost tracking — it parses Claude Code JSONL transcripts to compute your actual API spend per session. (4) Dashboard generation — it renders a Pillow PNG card with all stats laid out, which you can screenshot and share as a daily receipt.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does an AI content assistant with memory work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An AI content assistant with memory works by persisting context between sessions in files or a database the AI can read at startup. This tracker stores daily output logs as JSON, which Claude can read at the start of each session to know what you shipped yesterday, last week, or last month. The memory is not stored inside the model — it lives in your repo as structured data. That means you own it, can edit it, and can load as much or as little context as you need for any given session.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can an AI remember my writing style?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, but not by default. Claude and other LLMs do not retain anything between API calls. The way to make an AI remember your writing style is to store voice examples and rules in plain text files — usually called voice DNA or a style guide — and load them into the context at the start of each content session. This stack uses a core-voice.md file and a set of anti-pattern rules that get prepended to every content prompt. The AI does not learn from you over time; it reads from files you curate over time. That distinction matters: you control exactly what it absorbs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a good personal AI assistant for content creators?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on what you mean by assistant. This stack is not a chatbot you talk to — it is an automation layer that runs on a schedule and tracks what you shipped. For content creators specifically, it solves the problem of knowing what you actually produced on a given day across platforms like LinkedIn, X, Substack, and Reddit. If you write across multiple channels and lose track of where you are in the pipeline, the daily JSON log plus dashboard card gives you a single source of truth. Pair it with a voice DNA file and you get a system that tracks output and generates drafts in your voice.',
      },
    },
  ],
}

/* ── The self-contained prompt ── */

const TRACKER_PROMPT = `# Daily Activity Tracker — Build Your Own

You are a daily output tracker. Every evening (~8 PM), scan the user's work from the current calendar day (00:00–23:59) and generate a structured JSON log + a visual Pillow dashboard image.

## What You Track

Scan these sources for accomplishments:

1. **Git commits** — files added or modified in today's commits
2. **Untracked files** — new files with today's date in the filename (e.g., \`2026-02-14_slug.md\`)
3. **File modification time (mtime)** — walk key directories and find ANY file modified today, regardless of filename pattern. This is critical for work that doesn't have date-prefixed filenames.
4. **Content pipeline** — walk \`content/*/drafts/\` and \`content/*/final/\` for current state

### Directories to Scan by mtime

Customize these to match your repo structure:

- \`content/\` — drafts and finals
- \`scripts/\` — Python/shell scripts
- \`workflows/\` — workflow docs
- \`.cursor/skills/\` — Cursor agent skills
- \`.cursor/rules/\` — Cursor rules

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
| Finalized content (\`*_final\`) | 10 |
| New skill or workflow | 5 |
| Manual accomplishment | 5 |
| Cursor rule | 3 |
| Draft content (\`*_draft\`) | 2 |
| Script | 2 |

### Letter Grades

| Score | Grade |
|---|---|
| >= 200 | S (legendary) |
| >= 50 | A+ |
| 30–49 | A |
| 15–29 | B |
| 5–14 | C |
| < 5 | D |

### Computed Metrics

- **Output Score** = sum of weighted points from all accomplishments
- **Efficiency Rating** = Output Score / Total Token Cost (pts/$ — higher is better)

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
- **Background**: \`(12, 13, 17)\` — near-black
- **Panel fill**: \`(22, 24, 30)\` — dark gray
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
1. **Header row** — "DAILY TRACKER" in green + letter grade badge (colored pill) + date right-aligned
2. **Stat boxes row** — small cards: shipped count, finalized, pending TODOs, pipeline count, words today, commits, files touched, tokens, est. cost
3. **Platform breakdown bar** — e.g., \`LI:3  SUB:2  X:1\` with per-platform colors
4. **Three-column panels**:
   - **Left (40%)**: Accomplishments list — timestamp, [type tag], title (word count)
   - **Middle (32%)**: TODOs (high priority first) + Pipeline drafts (sorted by target date)
   - **Right (28%)**: Token usage — sessions, input/output/cache totals, cost, model breakdown, efficiency rating
5. **Footer** — summary stats centered

### Grade Badge Colors
- S: Gold \`(255, 200, 60)\`
- A+/A: Green \`(78, 195, 115)\`
- B: Cyan \`(80, 190, 220)\`
- C: Amber \`(220, 170, 60)\`
- D: Red \`(180, 70, 70)\`

## Implementation

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

### Dependencies
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

## Commands

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

export default function BuildYourOwnPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div style={container}>
      {/* Terminal header */}
      <h1 style={terminalHeader}>
        <span style={{ color: 'var(--accent)' }}>$</span> ./build-your-own-tracker.sh
      </h1>

      {/* ContentOS definition */}
      <div style={{ ...calloutBox, borderLeftColor: 'var(--accent)', marginBottom: '28px' }}>
        <div style={{ ...calloutTitle, color: 'var(--accent)' }}>What is ContentOS?</div>
        <p style={calloutText}>
          ContentOS is a personal AI content operating system - a set of prompts, scripts, and conventions that run your content pipeline the way an OS runs a machine.{' '}
          It combines a <Link href="/method" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>voice-driven methodology</Link> with automated tracking, scoring, and publishing so your AI works in your system, not a vendor&apos;s.{' '}
          See the full <Link href="/services" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>services</Link> if you want it built for you.
        </p>
      </div>

      {/* Intro */}
      <p style={{ ...heroSub, marginBottom: '24px', color: 'var(--text-secondary)' }}>
        If you want the step-by-step walkthrough,{' '}
        <Link href="/how-to" style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          how to make your own AI assistant for free
        </Link>{' '}
        is the place to start.{' '}
        Think of this as a build-your-own airplane kit for AI automation: all the components are here, pre-specified, ready to assemble - no subscriptions, no cloud dependency, no vendor controlling your runway.
        This build log documents what it actually looks like to construct a working AI agent from scratch - including building your own AI agent memory system that persists context between sessions.
        AI agent memory systems are not magic: they are structured files your agent reads at startup, a scoring layer that tracks what you shipped, and a daily log that grows over time.
        Everything documented here runs in production on a Mac Mini, firing nightly via launchd.
        The prompt below is the exact thing that powers it.
      </p>

      {/* Claude Code callout */}
      <div style={{ ...calloutBox, borderLeftColor: 'var(--accent)', marginBottom: '28px' }}>
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

      {/* Hero */}
      <h2 style={heroTitle}>Build Your Own AI Assistant - Airplane Kit Approach</h2>
      <p style={heroSub}>
        This is a live build log of a free AI agent automation stack using Claude, launchd, and Next.js.{' '}
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
        are generated by an AI-native tracking system — a scanner that auto-detects
        your daily output from git, file modification times, and content directories,
        then scores it and renders a visual dashboard card. Below is the full prompt
        you can drop into Cursor, Claude, or any AI IDE to build your own.
      </p>

      {/* Living document notice */}
      <div style={calloutBox}>
        <div style={calloutTitle}>Living Document</div>
        <p style={calloutText}>
          This prompt evolves as the tracker evolves. If the receipts change shape,
          gain new metrics, or add new scoring categories — so does this prompt.
          Changes only make it better. Bookmark this page and come back for the
          latest version.
        </p>
      </div>

      {/* AI agent memory callout */}
      <div style={{ ...calloutBox, borderLeftColor: 'var(--accent)' }}>
        <div style={{ ...calloutTitle, color: 'var(--accent)' }}>AI Agent Memory System</div>
        <p style={calloutText}>
          The same build-your-own approach applies to persistent agent memory — storing what your AI knows between sessions in files it can read at startup, not inside the model.{' '}
          Instead of re-explaining your context every time, you write it once to a structured file and load it on demand.{' '}
          See{' '}
          <Link
            href="/how-to"
            style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            the how-to guides
          </Link>{' '}
          for step-by-step walkthroughs on setting up file-based memory, voice DNA, and context handoffs for your own AI agent.
        </p>
      </div>

      {/* The prompt */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={sectionLabel}>the prompt</h3>
      </div>

      <div style={promptWrapper}>
        <CopyButton text={TRACKER_PROMPT} />
        <pre style={promptBlock}>{TRACKER_PROMPT}</pre>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: '48px', marginBottom: '32px' }}>
        <h3 style={sectionLabel}>FAQ</h3>
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
            q: 'How does an AI content assistant with memory work?',
            a: 'The memory lives in files, not inside the model. Claude does not remember anything between sessions by default — but if you store your daily output logs as JSON and load them at session start, the AI can read three months of history in seconds. That is what this tracker does. The "memory" is just structured data in your repo that you own, can edit, and can pass as context whenever it is relevant.',
          },
          {
            q: 'Can an AI actually remember your writing style?',
            a: 'Not automatically. What you can do is write down your voice as rules and examples — things like "no em dashes", "lead with the specific before the general", "never use the word impactful" — and store them in a plain text file. Every content session loads that file first. The AI is not learning from you over time; it is reading what you taught it to read. That is actually better, because you control exactly what gets reinforced.',
          },
          {
            q: 'Is this useful if I am a content creator, not a developer?',
            a: 'The tracker as-is requires a git repo and some Python comfort. But the underlying pattern works for anyone who ships content across multiple platforms and loses track of the pipeline. The JSON log + voice DNA approach scales down to a notes folder and a single markdown file if you want a lighter version. The core idea — auto-detect what you shipped, score it, and review it each evening — is useful regardless of the tech stack.',
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

      {/* Back link */}
      <Link href="/log" style={backLink}>
        &larr; Back to the log
      </Link>
      </div>
    </>
  )
}
