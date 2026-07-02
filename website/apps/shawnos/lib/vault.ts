// The Vault — server-only readers for content/vault/<category>/<file>.md.
// The directory IS the tree; frontmatter carries display metadata.
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const VAULT_ROOT = path.join(process.cwd(), '../../../content/vault')

const SLUG_RE = /^[a-z0-9-]+$/

export const VAULT_CATEGORIES: Record<
  string,
  { label: string; description: string; order: number }
> = {
  'voice-dna': {
    label: 'voice-dna',
    description: 'The voice system — core voice, principles, method, hooks. What makes the output sound like a person.',
    order: 1,
  },
  'anti-slop': {
    label: 'anti-slop',
    description: 'The 29-pattern detection system and the marketing-voice skill that keeps AI writing out of the slop bucket.',
    order: 2,
  },
  linkedin: {
    label: 'linkedin',
    description: 'LinkedIn playbook + the comment-drafting skill, voice-DNA driven.',
    order: 3,
  },
  x: {
    label: 'x',
    description: 'X/Twitter playbook + the engage skill.',
    order: 4,
  },
  reddit: {
    label: 'reddit',
    description: 'The Reddit system — growth SEO, strategy, commenting, and the engage skill behind 2M+ views.',
    order: 5,
  },
  'content-ops': {
    label: 'content-ops',
    description: 'The operating protocols — breadcrumbs, improvement gates, pre-publish checklist, substance requirements.',
    order: 6,
  },
  'context-engineering': {
    label: 'context-engineering',
    description: 'Context handoffs and agent routing — how sessions survive full context windows.',
    order: 7,
  },
}

export interface VaultFile {
  category: string
  slug: string
  title: string
  description: string
  source?: string
  updated?: string
  order: number
  content: string
  wordCount: number
}

export interface VaultTreeNode {
  id: string
  name: string
  type: 'folder' | 'file'
  href?: string
  children?: VaultTreeNode[]
}

function categoryDirs(): string[] {
  if (!fs.existsSync(VAULT_ROOT)) return []
  return fs
    .readdirSync(VAULT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && SLUG_RE.test(d.name))
    .map((d) => d.name)
    .sort(
      (a, b) => (VAULT_CATEGORIES[a]?.order ?? 99) - (VAULT_CATEGORIES[b]?.order ?? 99),
    )
}

function filesIn(category: string): string[] {
  const dir = path.join(VAULT_ROOT, category)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .filter((s) => SLUG_RE.test(s))
}

export function getVaultFile(category: string, slug: string): VaultFile | null {
  if (!SLUG_RE.test(category) || !SLUG_RE.test(slug)) return null
  const file = path.join(VAULT_ROOT, category, `${slug}.md`)
  if (!fs.existsSync(file)) return null
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  return {
    category,
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    source: data.source,
    updated: data.updated
      ? data.updated instanceof Date
        ? data.updated.toISOString().slice(0, 10)
        : String(data.updated)
      : undefined,
    order: typeof data.order === 'number' ? data.order : 99,
    content,
    wordCount: content.split(/\s+/).filter(Boolean).length,
  }
}

export function getCategoryFiles(category: string): VaultFile[] {
  return filesIn(category)
    .map((slug) => getVaultFile(category, slug))
    .filter((f): f is VaultFile => f !== null)
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
}

export function getVaultCategories(): Array<{
  slug: string
  label: string
  description: string
  count: number
}> {
  return categoryDirs().map((slug) => ({
    slug,
    label: VAULT_CATEGORIES[slug]?.label ?? slug,
    description: VAULT_CATEGORIES[slug]?.description ?? '',
    count: filesIn(slug).length,
  }))
}

export function getAllVaultParams(): Array<{ category: string; file: string }> {
  return categoryDirs().flatMap((category) =>
    filesIn(category).map((file) => ({ category, file })),
  )
}

export function getVaultTotalCount(): number {
  return getAllVaultParams().length
}

/** Tree for the FileTree component. Node ids are "category" / "category/slug". */
export function buildVaultTree(): VaultTreeNode[] {
  return categoryDirs().map((category) => ({
    id: category,
    name: `${category}/`,
    type: 'folder' as const,
    children: getCategoryFiles(category).map((f) => ({
      id: `${category}/${f.slug}`,
      name: `${f.slug}.md`,
      type: 'file' as const,
      href: `/vault/${category}/${f.slug}`,
    })),
  }))
}
