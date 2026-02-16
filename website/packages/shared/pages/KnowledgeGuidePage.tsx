'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

/* ── types ─────────────────────────────────────────── */

export interface KnowledgeTerm {
  name: string
  definition: string
  whyItMatters: string
  howYouUseIt: string
  related: string[]
}

export interface KnowledgeCategory {
  name: string
  prompt: string
  terms: KnowledgeTerm[]
}

export interface KnowledgeGuideConfig {
  terminalCommand: string
  intro: React.ReactNode
  categories: KnowledgeCategory[]
  outro: React.ReactNode
  navLinks: {
    left: { href: string; label: string }
    right: { href: string; label: string }
  }
}

/* ── utils ─────────────────────────────────────────── */

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/* ── styles ────────────────────────────────────────── */

const outerWrap: React.CSSProperties = {
  maxWidth: 1080,
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

const introBody: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const twoCol: React.CSSProperties = {
  display: 'flex',
  gap: '48px',
  alignItems: 'flex-start',
}

const mainCol: React.CSSProperties = {
  flex: '1 1 0',
  maxWidth: 720,
  minWidth: 0,
}

const tocSidebar: React.CSSProperties = {
  flex: '0 0 220px',
  position: 'sticky' as const,
  top: 80,
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto' as const,
  paddingBottom: 40,
}

const categoryPrompt: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--accent)',
  fontWeight: 400,
  letterSpacing: '0.5px',
  marginBottom: '16px',
  fontFamily: 'var(--font-mono)',
}

const categoryTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '28px',
  lineHeight: 1.3,
}

const termNameStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '8px',
  lineHeight: 1.3,
}

const termDefStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-primary)',
  marginBottom: '16px',
}

const fieldLabel: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '6px',
}

const fieldBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  marginBottom: '16px',
}

const relatedStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  marginBottom: 0,
}

const termDivider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px dashed var(--border)',
  margin: '32px 0',
  opacity: 0.5,
}

const tocHeader: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border)',
}

const mobileTocToggle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '12px 16px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  cursor: 'pointer',
  marginBottom: '16px',
}

const backLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

const ctaBlock: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--accent)',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
  marginTop: '32px',
}

const ctaTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '8px',
}

const ctaBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  marginBottom: '16px',
}

const ctaLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--canvas)',
  background: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  textDecoration: 'none',
  transition: 'opacity 0.15s ease',
}

/* ── data: Engineering / AI ────────────────────────── */

export const ENGINEERING_CATEGORIES: KnowledgeCategory[] = [
  {
    name: 'Version Control',
    prompt: '$ cd ~/version-control',
    terms: [
      {
        name: 'Git',
        definition:
          'Version control system that tracks changes to your code over time.',
        whyItMatters:
          "I didn't understand Git until I needed to revert a broken homepage. I'd changed something, refreshed localhost:3000, and the entire layout was gone. I panicked. Then realized I could just undo the commit and go back to when it worked. That's when it clicked. Git isn't just tracking changes. It's letting you time travel. Every commit is a save point. Every push is publishing your work.",
        howYouUseIt:
          'When I run /deploy, it stages changes, commits with a message, pushes to GitHub, and triggers Vercel. When I run the daily tracker, it scans git commits to see what I shipped. Git is the receipt for everything I build.',
        related: ['Commits', 'Branches', 'Push'],
      },
      {
        name: 'Commits',
        definition:
          'A snapshot of your files at a specific point in time with a message explaining what changed.',
        whyItMatters:
          "Commits are your paper trail. They tell the story of how you built something. Good commit messages make debugging easier. Bad commit messages make you hate yourself when you're trying to figure out what broke.",
        howYouUseIt:
          'git commit -m "add user authentication". The message should say what you did and why. Not "fix stuff" or "updates". That\'s useless.',
        related: ['Git', 'Push'],
      },
      {
        name: 'Branches',
        definition:
          'Separate versions of your code that let you work on features without breaking the main version.',
        whyItMatters:
          "Main branch is what's live. Feature branches are where you experiment. You can try things, break them, fix them, and only merge to main when they're ready.",
        howYouUseIt:
          "Create a branch for each feature. Test it. Merge it when it works. Delete the branch when you're done. Keeps main clean.",
        related: ['Merge Conflicts', 'Git'],
      },
      {
        name: 'Push',
        definition:
          'Sending your local commits to a remote server like GitHub or Vercel.',
        whyItMatters:
          "Your code isn't backed up until you push. Your team can't see it until you push. Automated deployments don't trigger until you push. Local commits are invisible.",
        howYouUseIt:
          'git push origin main. Push to main triggers auto-deploys on Vercel. Push to a feature branch creates a preview deployment.',
        related: ['Commits', 'Deploy'],
      },
      {
        name: 'Merge Conflicts',
        definition:
          "When Git can't automatically combine changes from two branches because they edited the same lines.",
        whyItMatters:
          "This is the tax you pay for collaboration. Two people edited the same file. Git doesn't know which version to keep. You have to choose manually.",
        howYouUseIt:
          "Open the file, look for the conflict markers (<<<<<<< and >>>>>>>), decide which code to keep, delete the markers, commit the resolution. It's annoying but necessary.",
        related: ['Branches', 'Git'],
      },
    ],
  },
  {
    name: 'Deployment',
    prompt: '$ cd ~/deployment',
    terms: [
      {
        name: 'Vercel',
        definition:
          'Hosting platform that deploys websites from Git repos with zero config.',
        whyItMatters:
          "The first time I pushed to main and saw Vercel build my site in 45 seconds, it felt like skipping straight to the good part. No FTP uploads, no manual file transfers \u2014 just push the code and it's live. Three websites (shawnos.ai, thegtmos.ai, thecontentos.ai) all deploy from one push. That's not magic. That's just how modern web development works.",
        howYouUseIt:
          "Every time I run /deploy, it pushes to GitHub, Vercel picks it up, builds all three sites, and they go live. I get a preview URL for every branch. If something breaks, I check the build logs. If it works, it's live in under a minute.",
        related: ['Deploy', 'Domains', 'Build Process'],
      },
      {
        name: 'Deploy',
        definition:
          'The process of making your local code changes live on the internet.',
        whyItMatters:
          "I spent the first week editing files and wondering why my changes weren't showing up on shawnos.ai. Then I realized local changes stay local until you deploy. The code on my machine and the code on the website are two different things. Deploying is the bridge.",
        howYouUseIt:
          "I built the /deploy skill so I don't have to remember the steps. It stages changes, writes a commit message, pushes to GitHub, waits for Vercel to build, and confirms all three sites are live. I type /deploy. Everything else happens automatically.",
        related: ['Vercel', 'Git', 'Push'],
      },
      {
        name: 'Build Process',
        definition:
          'The steps that transform your source code into the final website visitors see.',
        whyItMatters:
          'Next.js apps need to be compiled. TypeScript needs to convert to JavaScript. Dependencies need to be installed. The build process does all of this. If the build fails, your deploy fails.',
        howYouUseIt:
          'Locally, npm run dev builds in development mode with hot reload. On Vercel, the build happens automatically on every push. Check build logs if it fails.',
        related: ['Dependencies', 'Vercel'],
      },
      {
        name: 'Environment Variables',
        definition:
          "Secret values like API keys that you don't want in your code.",
        whyItMatters:
          "API keys, database passwords, MCP tokens. These can't live in your repo. They'd be public on GitHub. Environment variables let you reference them without exposing them.",
        howYouUseIt:
          "Create a .env file locally with API_KEY=your_key_here. Add it to .gitignore so it never gets committed. On Vercel, add the same variables in the dashboard so your deployed site can access them.",
        related: ['Environment Files'],
      },
      {
        name: 'Domains',
        definition:
          'The web address people type to visit your site.',
        whyItMatters:
          "shawnos.ai is more memorable than shawnos-abc123.vercel.app. Custom domains are how you own your presence. Vercel handles DNS, SSL certificates, and routing.",
        howYouUseIt:
          "Buy a domain from any registrar. Point the nameservers to Vercel or Cloudflare. Add the domain in Vercel's dashboard. It auto-configures HTTPS. Takes 10 minutes.",
        related: ['Vercel'],
      },
    ],
  },
  {
    name: 'AI Agents',
    prompt: '$ cd ~/ai-agents',
    terms: [
      {
        name: 'Parallel Agents',
        definition:
          'Running multiple AI agents at the same time on different tasks.',
        whyItMatters:
          'One agent generates LinkedIn drafts while another scans HeyReach campaigns. Parallel agents cut execution time in half. Sequential is one-at-a-time. Parallel is all-at-once.',
        howYouUseIt:
          'The Task tool launches agents. When you have independent tasks (scan repo + generate content + fetch API data), launch all three agents in one message. They run concurrently.',
        related: ['Agent Skills', 'Context Windows'],
      },
      {
        name: 'Agent Skills',
        definition:
          'Pre-written instructions that teach AI agents how to perform specific workflows.',
        whyItMatters:
          'Skills are portable knowledge. The /deploy skill knows how to stage, commit, push, and verify deploys. The /finalcopy skill knows your voice, platform rules, and anti-slop filters. Skills make agents consistent.',
        howYouUseIt:
          "Trigger with slash commands. /deploy runs the deploy skill. /tracker runs the daily tracker. Skills read your voice files, check your rules, follow your workflows. They're reusable automation.",
        related: ['MCP Servers', 'Parallel Agents'],
      },
      {
        name: 'MCP Servers',
        definition:
          'Model Context Protocol servers that give AI agents access to external tools and data sources.',
        whyItMatters:
          "MCP connects agents to Slack, HeyReach, Instantly, Browserbase, ClickUp, Substack. Without MCP, agents are blind to your production systems. With MCP, they can read Slack channels, pull campaign data, and push drafts to Substack.",
        howYouUseIt:
          'Install MCP servers in Cursor settings. Each server exposes tools the agent can call. Slack MCP gives search_messages and send_message. HeyReach MCP gives export_leads. The agent sees these as available actions.',
        related: ['Agent Skills'],
      },
      {
        name: 'Context Windows',
        definition:
          'The amount of text an AI model can see and remember in a single conversation.',
        whyItMatters:
          "Larger context = more files, more history, more continuity. Claude Sonnet 4.5 has 200k tokens. That's roughly 150k words. Big enough to load your entire voice system, recent conversation history, and current task context without forgetting.",
        howYouUseIt:
          "The agent auto-manages context. You don't. But knowing the limit exists helps you understand why agents sometimes lose track of earlier instructions. If you hit the limit, the agent summarizes and refreshes.",
        related: ['Model Selection', 'Parallel Agents'],
      },
      {
        name: 'Model Selection',
        definition:
          'Choosing which AI model to use based on task complexity and cost.',
        whyItMatters:
          'Opus is smarter but expensive. Sonnet is fast and cheap. For simple tasks (reformatting, scanning), use Sonnet. For complex reasoning (architecting, debugging), use Opus. Wrong model = wasted money or bad output.',
        howYouUseIt:
          "The daily tracker logs model usage. Opus sessions cost $12-15. Sonnet sessions cost $3-5. Track your spend. Optimize your model picks. Don't use Opus to count words.",
        related: ['Context Windows'],
      },
    ],
  },
  {
    name: 'Development Tools',
    prompt: '$ cd ~/dev-tools',
    terms: [
      {
        name: 'Markdown',
        definition:
          'Plain text format with simple syntax for headings, lists, links, and formatting.',
        whyItMatters:
          'All your content lives in markdown. Blog posts, drafts, voice files, workflows, skill documentation. Markdown is readable as plain text, version-controllable in Git, and renderable as HTML.',
        howYouUseIt:
          '# heading, **bold**, - list item, [link](url). Write in any text editor. Commit to Git. Render on your site. No proprietary formats. No lock-in.',
        related: ['Git'],
      },
      {
        name: 'Python Scripts',
        definition:
          'Small programs that automate tasks like scanning files, calculating scores, or generating images.',
        whyItMatters:
          'The daily tracker is a Python script. The dashboard generator is a Python script. Anytime you need to process files, calculate stats, or batch operations, Python is faster than doing it manually.',
        howYouUseIt:
          'The scripts/ folder holds all automation. daily_scan.py scans git and content folders. daily_dashboard.py generates the tracker card. Run them from the terminal or from agent skills.',
        related: ['Monorepo'],
      },
      {
        name: 'Monorepo',
        definition:
          'A single Git repo that holds multiple related projects with shared code.',
        whyItMatters:
          "I was planning one website. Then the agent and I scoped the architecture and realized one site couldn't hold everything. Three audiences, three domains. But I didn't want to manage three separate repos. So we built a monorepo. shawnos.ai, thegtmos.ai, thecontentos.ai all live in one repo. Same design system, same components, one push deploys all three.",
        howYouUseIt:
          'Turborepo manages the orchestration. packages/shared/ holds the components and styles all three sites use. apps/shawnos/, apps/gtmos/, apps/contentos/ are the individual sites. When I run /deploy, all three build and go live. One command, three websites.',
        related: ['Packages', 'Deploy'],
      },
      {
        name: 'Packages',
        definition:
          'Reusable modules of code that other projects can import.',
        whyItMatters:
          "You don't build everything from scratch. Next.js is a package. Pillow is a package. npm install pulls packages from the internet. They're pre-built solutions to common problems.",
        howYouUseIt:
          'package.json lists your dependencies. npm install downloads them. Packages live in node_modules/. You import them into your code. They update when you run npm update.',
        related: ['Dependencies', 'Monorepo'],
      },
      {
        name: 'Dependencies',
        definition:
          'External code your project relies on to function.',
        whyItMatters:
          "Your site depends on Next.js. Your tracker depends on Pillow. If dependencies aren't installed, nothing runs. If they're outdated, things break. Dependency management is invisible until it isn't.",
        howYouUseIt:
          "npm install installs all dependencies listed in package.json. pip install Pillow installs Python dependencies. Dependencies are tracked in lock files. Don't edit those manually.",
        related: ['Packages', 'Build Process'],
      },
    ],
  },
  {
    name: 'Automation',
    prompt: '$ cd ~/automation',
    terms: [
      {
        name: 'Cron Jobs',
        definition:
          'Scheduled tasks that run automatically at specific times.',
        whyItMatters:
          "You don't manually run the tracker every night. A cron job does it. Cron is how you automate recurring work. Backups, deploys, reports, data syncs. Set it once, forget it.",
        howYouUseIt:
          'Cron syntax is cryptic but powerful. 0 20 * * * means "run at 8 PM every day". You define the schedule and the command. The system handles execution.',
        related: ['Webhooks', 'Event-Driven Workflows'],
      },
      {
        name: 'Webhooks',
        definition:
          'URLs that external services call when an event happens.',
        whyItMatters:
          'When someone replies to your Instantly campaign, the webhook fires. When a HeyReach connection accepts, the webhook fires. Webhooks turn events into triggers. Real-time automation.',
        howYouUseIt:
          'Give the external service a URL to call. When the event happens, they POST data to that URL. Your system processes it. No polling. No waiting. Instant.',
        related: ['Event-Driven Workflows', 'Cron Jobs'],
      },
      {
        name: 'Event-Driven Workflows',
        definition:
          'Automation that reacts to events instead of running on a schedule.',
        whyItMatters:
          'Cron jobs run on time. Event-driven workflows run when something happens. Push to GitHub triggers deploy. New file in content folder triggers scan. Smarter than polling.',
        howYouUseIt:
          'Vercel auto-deploys on push events. MCP servers trigger on API calls. Watchers trigger on file changes. Design systems that react instead of poll.',
        related: ['Webhooks', 'Cron Jobs'],
      },
    ],
  },
  {
    name: 'Data Formats',
    prompt: '$ cd ~/data-formats',
    terms: [
      {
        name: 'JSON',
        definition:
          'JavaScript Object Notation. A text format for storing structured data.',
        whyItMatters:
          "APIs return JSON. Config files use JSON. Your daily tracker logs are JSON. It's readable by humans, parseable by machines. Key-value pairs, nested objects, arrays.",
        howYouUseIt:
          '{ "name": "value", "count": 5, "tags": ["tag1", "tag2"] }. JSON files end in .json. Parse them with JSON.parse() in JavaScript or json.load() in Python.',
        related: ['CSV', 'Configuration Files'],
      },
      {
        name: 'CSV',
        definition:
          'Comma-Separated Values. A simple spreadsheet format.',
        whyItMatters:
          'HeyReach exports CSVs. Clay imports CSVs. Instantly uploads CSVs. CSV is the universal data exchange format. Every tool supports it.',
        howYouUseIt:
          'First row is headers. Every row after is data. name,email,company. Open in Excel or Google Sheets. Import into Clay. Upload to campaigns.',
        related: ['JSON'],
      },
      {
        name: 'Environment Files',
        definition:
          'Files that store environment variables for local development.',
        whyItMatters:
          ".env files keep secrets out of Git. API keys, tokens, database URLs. They're local only. Each developer has their own. Vercel has its own set for production.",
        howYouUseIt:
          'Create .env in your project root. Add API_KEY=value. Add .env to .gitignore. Load variables with process.env.API_KEY in code.',
        related: ['Environment Variables'],
      },
      {
        name: 'Configuration Files',
        definition:
          'Files that define how tools should behave.',
        whyItMatters:
          'next.config.ts tells Next.js how to build. tsconfig.json tells TypeScript how to compile. .gitignore tells Git what to ignore. Config files control behavior without code changes.',
        howYouUseIt:
          'Read the docs for each tool. Copy starter configs. Tweak settings as needed. Commit config files to Git so everyone uses the same setup.',
        related: ['JSON', 'Environment Files'],
      },
    ],
  },
]

/* ── intro / outro JSX ────────────────────────────── */

const engineeringIntro: React.ReactNode = (
  <>
    <p style={introBody}>
      2 weeks ago I didn&apos;t know what a git repo was. not really.
    </p>
    <p style={introBody}>
      I&apos;d heard the word. I knew engineers used it. but I didn&apos;t
      understand it. I was an SDR who built systems in my head, in scattered
      Notion docs, in Slack messages I&apos;d never find again.
    </p>
    <p style={introBody}>
      then I built a meme generator. broke it. fixed it. learned what npm
      install meant. learned what version control actually was. learned the
      difference between asking AI to build something for you and asking AI to
      show you how while you&apos;re driving.
    </p>
    <p style={introBody}>
      I&apos;m not an engineer. I&apos;m not a developer. I&apos;m a builder
      who learned these terms by breaking things and reading error messages at
      2 AM.
    </p>
    <p style={introBody}>
      this is what I picked up along the way. the terms that showed up when I
      was deploying my first website. the concepts I needed when the build
      failed. the vocabulary that made AI agents less confusing and more useful.
    </p>
    <p style={introBody}>
      I&apos;m not the expert here. but I&apos;m sharing what I know, the best
      way I know how.
    </p>
    <p style={{ ...introBody, marginBottom: 0 }}>
      if you&apos;re building with AI agents in 2026, these are the words
      you&apos;ll hear. here&apos;s what they mean.
    </p>
  </>
)

const engineeringOutro: React.ReactNode = (
  <>
    <div style={categoryPrompt}>$ cat ~/toolkit.md</div>
    <h2 style={{ ...categoryTitleStyle, marginBottom: '16px' }}>
      the vibe coder toolkit
    </h2>

    <div
      style={{
        fontSize: '13px',
        lineHeight: 2,
        color: 'var(--text-secondary)',
        marginBottom: '24px',
      }}
    >
      version control &rarr; Git, commits, branches, push
      <br />
      deployment &rarr; Vercel, domains, environment variables
      <br />
      AI agents &rarr; skills, MCP, context windows, parallel execution
      <br />
      development &rarr; markdown, Python, monorepos, packages
      <br />
      automation &rarr; cron, webhooks, event-driven workflows
      <br />
      data &rarr; JSON, CSV, config files, environment files
    </div>

    <p style={introBody}>
      you don&apos;t need a CS degree. you need to know what these words mean.
      you need to recognize them in error messages. you need to know when to
      use which tool.
    </p>
    <p style={introBody}>
      the rest is just building. and if you get stuck, the agent knows all of
      this already. you&apos;re not alone.
    </p>
    <p style={{ ...introBody, fontWeight: 600, color: 'var(--accent)' }}>
      go build something.
    </p>

    <div style={ctaBlock}>
      <div style={ctaTitle}>want the GTM side?</div>
      <p style={ctaBody}>
        email campaigns, Clay, qualification, CRM. the go-to-market terms
        explained the same way.
      </p>
      <Link href="/knowledge/gtm" style={ctaLinkStyle}>
        GTM OS knowledge guide &rarr;
      </Link>
    </div>
  </>
)

/* ── component: KnowledgeGuideLayout ─────────────── */

export function KnowledgeGuideLayout({
  config,
}: {
  config: KnowledgeGuideConfig
}) {
  const [activeId, setActiveId] = useState('')
  const [tocOpen, setTocOpen] = useState(false)

  const allTermSlugs = useMemo(() => {
    const set = new Set<string>()
    for (const cat of config.categories) {
      for (const term of cat.terms) {
        set.add(toSlug(term.name))
      }
    }
    return set
  }, [config.categories])

  const categoryOfTerm = useMemo(() => {
    const map = new Map<string, string>()
    for (const cat of config.categories) {
      const catSlug = toSlug(cat.name)
      for (const term of cat.terms) {
        map.set(toSlug(term.name), catSlug)
      }
    }
    return map
  }, [config.categories])

  /* scroll-spy */
  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll('[data-toc-id]'),
    )
    if (headings.length === 0) return

    let raf = 0
    const update = () => {
      let id = ''
      for (const h of headings) {
        const rect = h.getBoundingClientRect()
        if (rect.top <= 100) {
          id = h.getAttribute('data-toc-id') || ''
        }
      }
      setActiveId(id)
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTocOpen(false)
    }
  }

  /* shared TOC renderer */
  const renderToc = () => (
    <nav>
      <div style={tocHeader}>on this page</div>
      {config.categories.map((cat) => {
        const catSlug = toSlug(cat.name)
        const isCatActive =
          activeId === catSlug ||
          categoryOfTerm.get(activeId) === catSlug

        return (
          <div key={catSlug} style={{ marginBottom: '8px' }}>
            <a
              href={`#${catSlug}`}
              onClick={(e) => {
                e.preventDefault()
                scrollToId(catSlug)
              }}
              className="kg-toc-link"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: isCatActive
                  ? 'var(--accent)'
                  : 'var(--text-primary)',
                textDecoration: 'none',
                padding: '4px 0',
                marginTop: '8px',
                transition: 'color 0.15s ease',
              }}
            >
              {cat.name}
            </a>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cat.terms.map((term) => {
                const termSlug = toSlug(term.name)
                const isActive = activeId === termSlug

                return (
                  <li key={termSlug}>
                    <a
                      href={`#${termSlug}`}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToId(termSlug)
                      }}
                      className="kg-toc-link"
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        color: isActive
                          ? 'var(--accent)'
                          : 'var(--text-muted)',
                        textDecoration: 'none',
                        padding: '3px 0 3px 12px',
                        borderLeft: isActive
                          ? '2px solid var(--accent)'
                          : '1px solid transparent',
                        transition:
                          'color 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      {term.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )

  return (
    <>
      <style>{`
        .kg-blink {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent);
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: kg-blink-kf 1s step-end infinite;
        }
        @keyframes kg-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        [data-toc-id] {
          scroll-margin-top: 90px;
        }
        .kg-toc-sidebar {
          display: block;
        }
        .kg-toc-mobile {
          display: none;
        }
        .kg-toc-sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .kg-toc-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .kg-toc-sidebar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }
        @media (max-width: 900px) {
          .kg-toc-sidebar {
            display: none !important;
          }
          .kg-toc-mobile {
            display: block !important;
          }
          .kg-two-col {
            flex-direction: column !important;
          }
        }
        .kg-toc-link:hover {
          color: var(--accent) !important;
        }
      `}</style>

      <div style={outerWrap}>
        {/* Terminal header */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span>{' '}
          {config.terminalCommand}
          <span className="kg-blink" />
        </h1>

        {/* Intro */}
        <section>{config.intro}</section>

        <hr style={divider} />

        {/* Mobile TOC */}
        <div className="kg-toc-mobile">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            style={mobileTocToggle}
            type="button"
          >
            <span>table of contents</span>
            <span style={{ fontSize: '10px' }}>
              {tocOpen ? '\u25B2' : '\u25BC'}
            </span>
          </button>
          {tocOpen && (
            <div
              style={{
                background: 'var(--canvas-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              {renderToc()}
            </div>
          )}
        </div>

        {/* Two-column layout */}
        <div className="kg-two-col" style={twoCol}>
          {/* Main content */}
          <div style={mainCol}>
            {config.categories.map((cat, catIdx) => {
              const catSlug = toSlug(cat.name)

              return (
                <React.Fragment key={catSlug}>
                  {catIdx > 0 && <hr style={divider} />}

                  <section>
                    <div style={categoryPrompt}>{cat.prompt}</div>
                    <h2
                      id={catSlug}
                      data-toc-id={catSlug}
                      style={categoryTitleStyle}
                    >
                      {cat.name}
                    </h2>

                    {cat.terms.map((term, termIdx) => {
                      const termSlug = toSlug(term.name)

                      return (
                        <React.Fragment key={termSlug}>
                          {termIdx > 0 && <hr style={termDivider} />}

                          <div>
                            <h3
                              id={termSlug}
                              data-toc-id={termSlug}
                              style={termNameStyle}
                            >
                              <Link
                                href={`/knowledge/${termSlug}`}
                                style={{
                                  color: 'inherit',
                                  textDecoration: 'none',
                                  borderBottom: '1px solid transparent',
                                  transition: 'border-color 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                                }}
                                onMouseLeave={(e) => {
                                  ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
                                }}
                              >
                                {term.name} →
                              </Link>
                            </h3>

                            <p style={termDefStyle}>
                              {term.definition}
                            </p>

                            <div style={fieldLabel}>
                              why it matters
                            </div>
                            <p style={fieldBody}>
                              {term.whyItMatters}
                            </p>

                            <div style={fieldLabel}>
                              how you use it
                            </div>
                            <p style={fieldBody}>
                              {term.howYouUseIt}
                            </p>

                            {term.related.length > 0 && (
                              <p style={relatedStyle}>
                                <span style={{ fontWeight: 600 }}>
                                  &rarr; related:{' '}
                                </span>
                                {term.related.map((r, i) => {
                                  const rSlug = toSlug(r)
                                  const exists =
                                    allTermSlugs.has(rSlug)
                                  return (
                                    <React.Fragment key={i}>
                                      {i > 0 && ', '}
                                      {exists ? (
                                        <a
                                          href={`#${rSlug}`}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            scrollToId(rSlug)
                                          }}
                                          className="kg-toc-link"
                                          style={{
                                            color:
                                              'var(--text-muted)',
                                            textDecoration: 'none',
                                          }}
                                        >
                                          {r}
                                        </a>
                                      ) : (
                                        r
                                      )}
                                    </React.Fragment>
                                  )
                                })}
                              </p>
                            )}
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </section>
                </React.Fragment>
              )
            })}

            {/* Outro */}
            <hr style={divider} />
            <section>{config.outro}</section>

            {/* Navigation */}
            <div
              style={{
                marginTop: '48px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <Link href={config.navLinks.left.href} style={backLink}>
                &larr; {config.navLinks.left.label}
              </Link>
              <Link href={config.navLinks.right.href} style={backLink}>
                {config.navLinks.right.label} &rarr;
              </Link>
            </div>
          </div>

          {/* TOC sidebar (desktop) */}
          <div className="kg-toc-sidebar" style={tocSidebar}>
            {renderToc()}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── exported page: Engineering / AI ─────────────── */

export function KnowledgeGuidePage() {
  return (
    <KnowledgeGuideLayout
      config={{
        terminalCommand: 'cat ~/knowledge/engineering-ai.md',
        intro: engineeringIntro,
        categories: ENGINEERING_CATEGORIES,
        outro: engineeringOutro,
        navLinks: {
          left: { href: '/', label: 'home' },
          right: { href: '/knowledge/gtm', label: 'GTM OS guide' },
        },
      }}
    />
  )
}
