'use client'

import Link from 'next/link'

interface ChapterLink {
  slug: string
  title: string
  partTitle: string
}

interface ChapterNavProps {
  guideSlug: string
  prev: ChapterLink | null
  next: ChapterLink | null
}

export function ChapterNav({ guideSlug, prev, next }: ChapterNavProps) {
  return (
    <nav className="chapter-nav" aria-label="Chapter navigation">
      {prev ? (
        <Link href={`/guide/${guideSlug}/${prev.slug}`}>
          <span className="chapter-nav-label">&larr; Previous</span>
          <span className="chapter-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/guide/${guideSlug}/${next.slug}`} style={{ textAlign: 'right', marginLeft: 'auto' }}>
          <span className="chapter-nav-label">Next &rarr;</span>
          <span className="chapter-nav-title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
