import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime: number
  wordCount: number
  category?: string
  featured?: boolean
}


/**
 * Returns an array of slugs (filenames without .md) from a content directory.
 */
export function getPostSlugs(contentDir: string): string[] {
  const exists = fs.existsSync(contentDir)
  if (!exists) return []
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

/**
 * Reads a single markdown file by slug, parses frontmatter with gray-matter.
 */
export function getPostBySlug(slug: string, contentDir: string): Post {
  const fullPath = path.join(contentDir, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const stripped = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[#*_~>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const words = stripped.split(' ').filter(Boolean).length

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? '',
    excerpt: (data.excerpt as string) ?? content.slice(0, 160).replace(/\n/g, ' '),
    content,
    readingTime: Math.max(1, Math.round(words / 200)),
    wordCount: words,
    category: (data.category as string) ?? undefined,
    featured: (data.featured as boolean) ?? undefined,
  }
}

/**
 * Returns all posts sorted by date descending.
 */
export function getAllPosts(contentDir: string): Post[] {
  const slugs = getPostSlugs(contentDir)
  return slugs
    .map((slug) => getPostBySlug(slug, contentDir))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

/** Lightweight post shape returned by getRelatedPosts (no content/wordCount/readingTime). */
export interface RelatedPost {
  slug: string
  title: string
  date: string
  category?: string
  excerpt: string
}

/**
 * Returns up to 3 related posts for a given slug.
 * Priority: same category first (most recent), then most recent from any category.
 * The current post is always excluded.
 */
export function getRelatedPosts(
  currentSlug: string,
  currentCategory: string | undefined,
  allPosts: Post[],
  limit = 3,
): RelatedPost[] {
  const candidates = allPosts.filter((p) => p.slug !== currentSlug)

  const sameCategory = currentCategory
    ? candidates.filter((p) => p.category === currentCategory)
    : []
  const otherCategory = candidates.filter(
    (p) => !currentCategory || p.category !== currentCategory,
  )

  const picked: Post[] = []
  for (const p of sameCategory) {
    if (picked.length >= limit) break
    picked.push(p)
  }
  for (const p of otherCategory) {
    if (picked.length >= limit) break
    picked.push(p)
  }

  return picked.map(({ slug, title, date, category, excerpt }) => ({
    slug,
    title,
    date,
    category,
    excerpt,
  }))
}
