import type { Metadata } from 'next'
import Link from 'next/link'
import CopyButton from './CopyButton'

/* ── Metadata & SEO ── */

export const metadata: Metadata = {
  title: 'Build Your Own Daily Tracker',
  description:
    'A copy-paste prompt to build your own AI-native daily activity tracker — auto-detects output from git, file mtime, and content directories, scores it, and renders a visual dashboard.',
  keywords: [
    'daily tracker',
    'AI workflow',
    'build in public',
    'Cursor IDE',
    'Claude prompt',
    'daily output',
    'developer dashboard',
    'Pillow dashboard',
  ],
  alternates: { canonical: 'https://thegtmos.ai/log/build-your-own' },
  openGraph: {
    title: 'Build Your Own Daily Tracker | thegtmos.ai',
    description:
      'A copy-paste prompt to build your own AI-native daily activity tracker — auto-detects output, scores it, and renders a visual dashboard.',
    url: 'https://thegtmos.ai/log/build-your-own',
    images: [
      {
        url: '/og?title=Build+Your+Own+Tracker&subtitle=The+prompt+behind+the+daily+receipts',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'Build Your Own Daily Tracker | thegtmos.ai',
    description:
      'A copy-paste prompt to build your own AI-native daily activity tracker — auto-detects output, scores it, and renders a visual dashboard.',
    images: [
      '/og?title=Build+Your+Own+Tracker&subtitle=The+prompt+behind+the+daily+receipts',
    ],
  },
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
    <div style={container}>
      {/* Terminal header */}
      <h1 style={terminalHeader}>
        <span style={{ color: 'var(--accent)' }}>$</span> ./build-your-own-tracker.sh
      </h1>

      {/* Hero */}
      <h2 style={heroTitle}>Build Your Own Daily Tracker</h2>
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

      {/* The prompt */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={sectionLabel}>the prompt</h3>
      </div>

      <div style={promptWrapper}>
        <CopyButton text={TRACKER_PROMPT} />
        <pre style={promptBlock}>{TRACKER_PROMPT}</pre>
      </div>

      {/* Back link */}
      <Link href="/log" style={backLink}>
        &larr; Back to the log
      </Link>
    </div>
  )
}
