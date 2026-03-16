export interface Repo {
  name: string
  description: string
  url: string
  category: 'mine' | 'community' | 'recommended' | 'projects'
  tags: string[]
  stars?: number
  author?: string
  authorUrl?: string
  featured?: boolean
  dateAdded: string
  /** Live project URL — shows a "Live" badge + link on the card */
  projectUrl?: string
}

export const repos: Repo[] = [
  // ── projects — live websites and apps with their own UI ──
  {
    name: 'ShawnOS',
    description: 'Personal brand site, blog, portfolio, and lab. The hub that connects everything. 4 live websites from a single Turborepo monorepo.',
    url: 'https://github.com/shawnla90/shawn-gtme-os',
    projectUrl: 'https://shawnos.ai',
    category: 'projects',
    tags: ['Next.js', 'Turborepo', 'Vercel', 'i18n'],
    featured: true,
    dateAdded: '2026-01-15',
  },
  {
    name: 'theGTMOS.ai',
    description: 'Automated ABM pipeline — discovers companies, researches them, generates personalized landing pages, syncs to CRM, and runs outbound sequences. The landing page IS the pitch.',
    url: 'https://github.com/shawnla90/shawn-gtme-os',
    projectUrl: 'https://thegtmos.ai',
    category: 'projects',
    tags: ['ABM', 'Python', 'Supabase', 'Apollo', 'Lemlist'],
    dateAdded: '2026-02-01',
  },
  {
    name: 'theContentOS.ai',
    description: 'Multi-platform content pipeline. Drafts, finals, automated blog generation, content wiki, and SEO optimization. Publishes across LinkedIn, X, Substack, and the blog.',
    url: 'https://github.com/shawnla90/shawn-gtme-os',
    projectUrl: 'https://thecontentos.ai',
    category: 'projects',
    tags: ['Content', 'Python', 'SQLite', 'Claude API'],
    dateAdded: '2026-02-10',
  },
  {
    name: 'NioBot',
    description: 'AI assistant with evolution system, memory, and personality. Tamagotchi-meets-chatbot. XP progression, soul files, and a DNA lab where you can watch it level up.',
    url: 'https://github.com/shawnla90/shawn-gtme-os',
    projectUrl: 'https://shawnos.ai/lab/nio-dna',
    category: 'projects',
    tags: ['AI agent', 'SQLite', 'SSE', 'evolution'],
    dateAdded: '2026-02-20',
  },
  {
    name: 'Crypto OS',
    description: 'AI-powered crypto signal analyzer. $100 budget. Cyborg model: AI analyzes, I decide, I execute. Twice-daily signals auto-deployed to a live dashboard.',
    url: 'https://github.com/shawnla90/crypto-os',
    projectUrl: 'https://shawnos.ai/lab/crypto',
    category: 'projects',
    tags: ['Python', 'CoinGecko', 'signals', 'build-in-public'],
    dateAdded: '2026-03-15',
  },

  // ── mine — open source repos ──
  {
    name: 'structured-divergence',
    description: 'Why ADHD/pattern-recognition brains + Claude Code = cognitive unlock. The philosophical foundation above the trilogy.',
    url: 'https://github.com/shawnla90/structured-divergence',
    category: 'mine',
    tags: ['methodology', 'ADHD', 'cognitive'],
    featured: true,
    dateAdded: '2026-03-14',
  },
  {
    name: 'crypto-os',
    description: '$100 crypto journey built in public. Signal methodology, sanitized examples, cyborg model documentation, and free API resources.',
    url: 'https://github.com/shawnla90/crypto-os',
    projectUrl: 'https://shawnos.ai/lab/crypto',
    category: 'mine',
    tags: ['crypto', 'signals', 'build-in-public'],
    dateAdded: '2026-03-15',
  },
  {
    name: 'website-with-soul',
    description: '32-chapter playbook + working starter template for building a website that compounds. 90% free stack.',
    url: 'https://github.com/shawnla90/website-with-soul',
    category: 'mine',
    tags: ['Next.js', 'playbook', 'starter'],
    dateAdded: '2026-03-14',
  },
  {
    name: 'context-handoff-engine',
    description: '6 layers of context infrastructure for Claude Code. Parallel-safe handoffs, structured memory, self-improvement loops.',
    url: 'https://github.com/shawnla90/context-handoff-engine',
    category: 'mine',
    tags: ['Claude Code', 'context', 'memory'],
    dateAdded: '2026-03-13',
  },
  {
    name: 'recursive-drift',
    description: 'The operating system for thinking with AI. 6 states, a self-reading feedback loop, zero API keys.',
    url: 'https://github.com/shawnla90/recursive-drift',
    category: 'mine',
    tags: ['methodology', 'AI collaboration'],
    dateAdded: '2026-03-12',
  },

  // community - populated as r/GTMBuilders members share repos
  // recommended - populated with tools Shawn uses
]
