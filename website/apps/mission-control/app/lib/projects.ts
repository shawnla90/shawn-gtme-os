export interface Project {
  slug: string
  name: string
  description: string
  path: string
  techStack: string[]
  team: string[]
  status: 'active' | 'maintenance' | 'planned'
}

export const PROJECTS: Project[] = [
  {
    slug: 'command-center',
    name: 'Command Center',
    description: 'Mission Control dashboard — SQLite explorer, CRM, content browser, project management',
    path: 'website/apps/mission-control/',
    techStack: ['Next.js 15', 'TypeScript', 'SQLite', 'Tailwind'],
    team: ['claude-code', 'qwen'],
    status: 'active',
  },
  {
    slug: 'niobot-chat',
    name: 'NioBot Chat',
    description: 'AI assistant with evolution system, memory, and personality — Tamagotchi-meets-chatbot',
    path: 'website/apps/nio-chat/',
    techStack: ['Next.js', 'TypeScript', 'SQLite', 'SSE'],
    team: ['nio', 'claude-code'],
    status: 'active',
  },
  {
    slug: 'shawnos-website',
    name: 'ShawnOS Website',
    description: 'Personal brand site — blog, about, portfolio with SEO pipeline',
    path: 'website/apps/shawnos/',
    techStack: ['Next.js', 'TypeScript', 'MDX', 'Cloudflare'],
    team: ['claude-code', 'opus'],
    status: 'active',
  },
  {
    slug: 'content-system',
    name: 'Content System',
    description: 'Multi-platform content pipeline — drafts, finals, automated blog generation',
    path: 'content/',
    techStack: ['Python', 'SQLite', 'Markdown', 'Claude API'],
    team: ['opus', 'nio'],
    status: 'active',
  },
  {
    slug: 'gtm-system',
    name: 'GTM System',
    description: 'Go-to-market infrastructure — partner workflows, CRM data, outbound automation',
    path: 'clients/',
    techStack: ['Python', 'Markdown', 'SQLite'],
    team: ['claude-code'],
    status: 'active',
  },
  {
    slug: 'crypto-os',
    name: 'Crypto OS',
    description: 'AI-powered crypto signal analyzer — cyborg model: AI analyzes, human decides, human executes',
    path: 'crypto-os/',
    techStack: ['Python', 'CoinGecko API', 'Reddit PRAW', 'LaunchD'],
    team: ['claude-code'],
    status: 'active',
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}
