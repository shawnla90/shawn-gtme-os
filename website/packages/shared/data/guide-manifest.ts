// Guide manifest — typed chapter ordering, navigation helpers, and metadata

export interface GuideChapter {
  order: number
  slug: string
  title: string
  subtitle: string
  part: number
  partTitle: string
  /** GitHub path relative to repo root */
  githubPath?: string
}

export interface GuidePart {
  part: number
  title: string
  chapters: GuideChapter[]
}

export interface GuideManifest {
  slug: string
  title: string
  subtitle: string
  author: string
  description: string
  githubRepo: string
  githubUrl: string
  date: string
  tags?: string[]
  parts: GuidePart[]
  chapters: GuideChapter[]
}

const chapters: GuideChapter[] = [
  {
    order: 0,
    slug: 'preface',
    title: 'Why This Book Exists',
    subtitle: 'The gap between knowing AI exists and using it to build your pipeline',
    part: 0,
    partTitle: 'Bookends',
  },
  {
    order: 1,
    slug: '01-coding-agents-vs-editors',
    title: 'Coding Agents vs Code Editors',
    subtitle: 'A coding agent builds things. A code editor autocompletes your lines. Know the difference.',
    part: 1,
    partTitle: 'Foundations',
    githubPath: 'chapters/01-coding-agents-vs-editors.md',
  },
  {
    order: 2,
    slug: '02-context-engineering',
    title: 'Context Engineering',
    subtitle: 'The quality of your output is determined by the quality of your context, not your prompt.',
    part: 1,
    partTitle: 'Foundations',
    githubPath: 'chapters/02-context-engineering.md',
  },
  {
    order: 3,
    slug: '03-token-efficiency',
    title: 'Token Efficiency',
    subtitle: 'How to manage your context window without burning money or losing coherence.',
    part: 1,
    partTitle: 'Foundations',
    githubPath: 'chapters/03-token-efficiency.md',
  },
  {
    order: 4,
    slug: '04-oauth-cli-apis',
    title: 'OAuth, CLI, and APIs',
    subtitle: 'Three ways to connect tools to your agent. Pick the right one for each job.',
    part: 2,
    partTitle: 'The GTM Stack',
    githubPath: 'chapters/04-oauth-cli-apis.md',
  },
  {
    order: 5,
    slug: '05-automation-agents',
    title: 'Automation Agents',
    subtitle: 'Build agents that run your GTM workflows while you sleep.',
    part: 2,
    partTitle: 'The GTM Stack',
    githubPath: 'chapters/05-automation-agents.md',
  },
  {
    order: 6,
    slug: '06-local-first-gtm',
    title: 'Local-First GTM',
    subtitle: 'Run your pipeline on your own machine. No vendor lock-in. No monthly fees.',
    part: 2,
    partTitle: 'The GTM Stack',
    githubPath: 'chapters/06-local-first-gtm.md',
  },
  {
    order: 7,
    slug: '07-python-for-gtm',
    title: 'Python for GTM',
    subtitle: 'The language that connects every API in your stack.',
    part: 2,
    partTitle: 'The GTM Stack',
    githubPath: 'chapters/07-python-for-gtm.md',
  },
  {
    order: 8,
    slug: '08-tools-ecosystem',
    title: 'The Tools Ecosystem',
    subtitle: 'Every tool in the modern GTM stack and when to use each one.',
    part: 3,
    partTitle: 'The Operating System',
    githubPath: 'chapters/08-tools-ecosystem.md',
  },
  {
    order: 9,
    slug: '09-voice-dna-content',
    title: 'Voice DNA and Content',
    subtitle: 'Extract your authentic voice so AI content sounds like you, not a robot.',
    part: 3,
    partTitle: 'The Operating System',
    githubPath: 'chapters/09-voice-dna-content.md',
  },
  {
    order: 10,
    slug: '10-terminal-mastery',
    title: 'Terminal Mastery',
    subtitle: 'The terminal is your cockpit. Learn to fly it.',
    part: 3,
    partTitle: 'The Operating System',
    githubPath: 'chapters/10-terminal-mastery.md',
  },
  {
    order: 11,
    slug: '11-pick-your-primitive',
    title: 'Pick Your Primitive',
    subtitle: 'CLI vs MCP vs API. When each one is the right call, and why the answer depends on who you are more than what you’re doing.',
    part: 3,
    partTitle: 'The Operating System',
    githubPath: 'chapters/11-pick-your-primitive.md',
  },
  {
    order: 12,
    slug: 'afterword',
    title: 'Fork It, Build It, Ship It',
    subtitle: 'This is an open-source playbook. Take it and make it yours.',
    part: 0,
    partTitle: 'Bookends',
  },
]

function buildParts(chs: GuideChapter[]): GuidePart[] {
  const map = new Map<number, GuidePart>()
  for (const ch of chs) {
    if (!map.has(ch.part)) {
      map.set(ch.part, { part: ch.part, title: ch.partTitle, chapters: [] })
    }
    map.get(ch.part)!.chapters.push(ch)
  }
  return Array.from(map.values()).sort((a, b) => {
    // Part 0 "Bookends" splits: preface goes first, afterword goes last
    if (a.part === 0 && b.part === 0) return 0
    if (a.part === 0) {
      // Check if this part-0 chunk is the preface or afterword
      const aMin = Math.min(...a.chapters.map((c) => c.order))
      return aMin === 0 ? -1 : 1
    }
    if (b.part === 0) {
      const bMin = Math.min(...b.chapters.map((c) => c.order))
      return bMin === 0 ? 1 : -1
    }
    return a.part - b.part
  })
}

export const GTM_CODING_AGENT_GUIDE: GuideManifest = {
  slug: 'gtm-coding-agent',
  title: 'The GTM Coding Agent Playbook',
  subtitle: 'Build your go-to-market engine with AI coding agents',
  author: 'Shawn Tenam',
  description:
    'A 12-chapter guide to building GTM infrastructure with coding agents. From context engineering to automation pipelines, terminal mastery to voice DNA.',
  githubRepo: 'shawnla90/gtm-coding-agent',
  githubUrl: 'https://github.com/shawnla90/gtm-coding-agent',
  date: '2026-03-27',
  parts: buildParts(chapters),
  chapters,
}

const devopsChapters: GuideChapter[] = [
  {
    order: 0,
    slug: 'intro',
    title: 'AI in DevOps: What Actually Changes',
    subtitle: 'The shift from manual pipelines to AI-augmented delivery loops',
    part: 0,
    partTitle: 'Overview',
  },
  {
    order: 1,
    slug: '01-cicd-automation',
    title: 'CI/CD Automation with AI',
    subtitle: 'Let agents write pipeline configs, catch regressions, and unblock failing builds.',
    part: 1,
    partTitle: 'Core Workflows',
    githubPath: 'chapters/01-cicd-automation.md',
  },
  {
    order: 2,
    slug: '02-ai-code-review',
    title: 'AI-Assisted Code Review',
    subtitle: 'Automate the mechanical parts of review so humans focus on architecture and intent.',
    part: 1,
    partTitle: 'Core Workflows',
    githubPath: 'chapters/02-ai-code-review.md',
  },
  {
    order: 3,
    slug: '03-incident-response',
    title: 'Incident Response with AI',
    subtitle: 'From alert to postmortem — how AI shortens the blast radius of production incidents.',
    part: 1,
    partTitle: 'Core Workflows',
    githubPath: 'chapters/03-incident-response.md',
  },
]

export const AI_DEVOPS_GUIDE: GuideManifest = {
  slug: 'ai-in-devops',
  title: 'How to Use AI in DevOps',
  subtitle: 'CI/CD automation, AI-assisted code review, and faster incident response',
  author: 'Shawn Tenam',
  description:
    'A practical guide to wiring AI into your DevOps workflow. Covers CI/CD pipeline automation, AI-assisted code review to cut review time without losing quality, and AI-accelerated incident response from alert triage to postmortem.',
  githubRepo: '',
  githubUrl: '',
  date: '2026-04-28',
  tags: ['devops', 'ci-cd', 'code-review', 'incident-response', 'automation', 'ai'],
  parts: buildParts(devopsChapters),
  chapters: devopsChapters,
}

const runAiLocallyChapters: GuideChapter[] = [
  {
    order: 0,
    slug: 'intro',
    title: 'How to Run AI Locally: The No-Cloud Setup',
    subtitle: 'Ollama, LM Studio, and the exact steps to get a capable AI model running on your own hardware — no API keys, no subscriptions.',
    part: 0,
    partTitle: 'Guide',
    githubPath: 'chapters/intro.md',
  },
]

export const RUN_AI_LOCALLY_GUIDE: GuideManifest = {
  slug: 'run-ai-locally',
  title: 'How to Run AI Locally: The No-Cloud Setup',
  subtitle: 'Run capable AI models on your own hardware — no API keys, no subscriptions, no data leaving your machine',
  author: 'Shawn Tenam',
  description:
    'Step-by-step guide to running AI locally on Windows and Mac. Covers Ollama and LM Studio setup, model selection, hardware requirements, and how to wire local models into your existing tools — completely offline, completely free.',
  githubRepo: '',
  githubUrl: '',
  date: '2026-05-30',
  tags: ['local-ai', 'ollama', 'lm-studio', 'offline-ai', 'privacy', 'no-cloud'],
  parts: buildParts(runAiLocallyChapters),
  chapters: runAiLocallyChapters,
}

// --- Helpers ---

const GUIDES: Record<string, GuideManifest> = {
  'gtm-coding-agent': GTM_CODING_AGENT_GUIDE,
  'ai-in-devops': AI_DEVOPS_GUIDE,
  'run-ai-locally': RUN_AI_LOCALLY_GUIDE,
}

export function getGuideBySlug(slug: string): GuideManifest | undefined {
  return GUIDES[slug]
}

export function getAllGuides(): GuideManifest[] {
  return Object.values(GUIDES)
}

export function getChapterBySlug(
  guideSlug: string,
  chapterSlug: string,
): GuideChapter | undefined {
  const guide = GUIDES[guideSlug]
  if (!guide) return undefined
  return guide.chapters.find((c) => c.slug === chapterSlug)
}

export function getAdjacentChapters(
  guideSlug: string,
  chapterSlug: string,
): { prev: GuideChapter | null; next: GuideChapter | null } {
  const guide = GUIDES[guideSlug]
  if (!guide) return { prev: null, next: null }
  const sorted = [...guide.chapters].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex((c) => c.slug === chapterSlug)
  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  }
}

export function getChapterIndex(
  guideSlug: string,
  chapterSlug: string,
): { current: number; total: number } {
  const guide = GUIDES[guideSlug]
  if (!guide) return { current: 0, total: 0 }
  const sorted = [...guide.chapters].sort((a, b) => a.order - b.order)
  const idx = sorted.findIndex((c) => c.slug === chapterSlug)
  return { current: idx + 1, total: sorted.length }
}
