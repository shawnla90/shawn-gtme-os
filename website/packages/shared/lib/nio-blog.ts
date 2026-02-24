import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface NioBlogPost {
  slug: string
  title: string
  date: string
  timestamp: string
  preview: string
  content: string
  seo_keyword?: string
}

/**
 * Resolves the nio-log content directory. Tries multiple candidates
 * so it works whether cwd is website/apps/shawnos, website/, or repo root.
 */
export function resolveNioBlogDir(cwd: string = process.cwd()): string {
  const candidates = [
    path.join(cwd, '../../../content/nio-log'),   // from apps/shawnos
    path.join(cwd, '../../content/nio-log'),       // from website/
    path.join(cwd, 'content/nio-log'),             // from repo root
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return candidates[0]!
}

/**
 * Returns all nio-log slugs sorted newest-first.
 * Date-based slugs (YYYY-MM-DD) sort before named slugs (post-zero, post-one).
 */
export function getNioBlogSlugs(dir?: string): string[] {
  const blogDir = dir ?? resolveNioBlogDir()
  if (!fs.existsSync(blogDir)) return []

  const slugs = fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))

  const dateSlugs = slugs.filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s)).sort((a, b) => b.localeCompare(a))
  const namedSlugs = slugs.filter((s) => !/^\d{4}-\d{2}-\d{2}$/.test(s))

  // Named slugs sorted by their frontmatter date, newest first
  const namedWithDate = namedSlugs.map((slug) => {
    try {
      const raw = fs.readFileSync(path.join(blogDir, `${slug}.md`), 'utf-8')
      const { data } = matter(raw)
      return { slug, date: (data.date as string) ?? '' }
    } catch {
      return { slug, date: '' }
    }
  }).sort((a, b) => b.date.localeCompare(a.date))

  return [...dateSlugs, ...namedWithDate.map((n) => n.slug)]
}

/**
 * Read a single nio-log post by slug.
 */
export function getNioBlogPost(slug: string, dir?: string): NioBlogPost | null {
  const blogDir = dir ?? resolveNioBlogDir()
  const filePath = path.join(blogDir, `${slug}.md`)

  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  const title = (data.title as string) ?? slug
  const date = (data.date as string) ?? ''
  const displayDate = date.replace(/-/g, '.')
  const timestamp = (data.timestamp as string) ?? '8:00am EST'
  const preview = (data.preview as string) ?? content.slice(0, 200).replace(/\n/g, ' ').replace(/#/g, '').trim()

  return {
    slug,
    title,
    date: displayDate,
    timestamp,
    preview,
    content: content.trim(),
    seo_keyword: data.seo_keyword as string | undefined,
  }
}

/**
 * Returns all nio-log posts, newest first.
 */
export function getAllNioBlogPosts(dir?: string): NioBlogPost[] {
  const blogDir = dir ?? resolveNioBlogDir()
  const slugs = getNioBlogSlugs(blogDir)
  return slugs
    .map((slug) => getNioBlogPost(slug, blogDir))
    .filter((p): p is NioBlogPost => p !== null)
}
