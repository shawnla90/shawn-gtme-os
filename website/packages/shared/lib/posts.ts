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
  // #region agent log
  const exists = fs.existsSync(contentDir)
  fetch('http://127.0.0.1:7243/ingest/2ae96287-cf1e-48b7-8e72-bc016034aed8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'posts.ts:getPostSlugs',message:'getPostSlugs entry',data:{contentDir,exists,cwd:process.cwd()},hypothesisId:'H2',timestamp:Date.now()})}).catch(()=>{});
  // #endregion
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
  // #region agent log
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? '',
      excerpt: (data.excerpt as string) ?? content.slice(0, 160).replace(/\n/g, ' '),
      content,
    }
  } catch (err) {
    fetch('http://127.0.0.1:7243/ingest/2ae96287-cf1e-48b7-8e72-bc016034aed8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'posts.ts:getPostBySlug',message:'getPostBySlug threw',data:{fullPath,slug,contentDir,error:String(err),stack:(err as Error)?.stack},hypothesisId:'H3',timestamp:Date.now()})}).catch(()=>{});
    throw err
  }
  // #endregion
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
