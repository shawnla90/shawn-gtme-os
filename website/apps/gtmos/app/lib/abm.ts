import fs from 'fs'
import path from 'path'

/* ── PageData types ─────────────────────────────── */

export interface PageTheme {
  primary: string
  primaryLight: string
  primaryGlow: string
}

export interface PageStat {
  value: string
  label: string
}

export interface PageChallenge {
  icon: string
  title: string
  desc: string
}

export interface PageDeliverable {
  title: string
  desc: string
  tags: string[]
}

export interface PageEngagementStep {
  title: string
  subtitle: string
  desc: string
}

export interface PageFaqItem {
  question: string
  answer: string
}

export interface PageStackItem {
  name: string
  role: string
}

export interface PageData {
  slug: string
  company: string
  domain: string
  contactName: string
  contactRole: string
  theme: PageTheme
  headline: string
  subheadline: string
  stats: PageStat[]
  challenges: PageChallenge[]
  deliverables: PageDeliverable[]
  engagementSteps: PageEngagementStep[]
  faqItems: PageFaqItem[]
  stackItems?: PageStackItem[]
  generatedAt: string
}

/* ── data directory ─────────────────────────────── */

const PAGES_DIR = path.join(process.cwd(), '..', '..', '..', 'data', 'abm', 'pages')

/* ── helpers ─────────────────────────────────────── */

export function getAllSlugs(): string[] {
  if (!fs.existsSync(PAGES_DIR)) return []
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''))
}

export function getPageData(slug: string): PageData | null {
  const filePath = path.join(PAGES_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as PageData
}
