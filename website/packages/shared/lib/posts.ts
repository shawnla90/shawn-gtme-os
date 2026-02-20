import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
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

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? '',
    excerpt: (data.excerpt as string) ?? content.slice(0, 160).replace(/\n/g, ' '),
    content,
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
