export interface Repo {
  name: string
  description: string
  url: string
  category: 'mine' | 'community' | 'recommended'
  tags: string[]
  stars?: number
  author?: string
  authorUrl?: string
  featured?: boolean
  dateAdded: string
}

export const repos: Repo[] = [
  // mine
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
