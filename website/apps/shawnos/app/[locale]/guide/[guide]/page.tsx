import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { notFound } from 'next/navigation'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { getGuideBySlug, getAllGuides } from '@shawnos/shared/data/guide-manifest'
import { getPostBySlug } from '@shawnos/shared/lib'
import { Link } from '../../../../i18n/navigation'
import { GitHubCTA } from './GitHubCTA'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_BASE = path.join(process.cwd(), '../../../content/guides')

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ guide: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guide: string }>
}): Promise<Metadata> {
  const { guide: guideSlug } = await params
  const guide = getGuideBySlug(guideSlug)
  if (!guide) return {}

  const url = `${SITE_URL}/guide/${guideSlug}`
  const ogImage = `/og?title=${encodeURIComponent(guide.title)}&subtitle=${encodeURIComponent(guide.subtitle)}`

  return {
    title: `${guide.title} | shawnos.ai`,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: guide.title,
      description: guide.description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
      images: [ogImage],
    },
  }
}

export default async function GuideLandingPage({
  params,
}: {
  params: Promise<{ guide: string }>
}) {
  const { guide: guideSlug } = await params
  const guide = getGuideBySlug(guideSlug)
  if (!guide) notFound()

  const guideContentDir = path.join(CONTENT_BASE, guideSlug)

  // Compute total word count and reading time
  let totalWords = 0
  const sorted = [...guide.chapters].sort((a, b) => a.order - b.order)
  for (const ch of sorted) {
    const filePath = path.join(guideContentDir, `${ch.slug}.md`)
    if (fs.existsSync(filePath)) {
      const post = getPostBySlug(ch.slug, guideContentDir)
      totalWords += post.wordCount
    }
  }
  const totalReadingTime = Math.max(1, Math.round(totalWords / 200))

  // Group chapters into display parts (preface first, afterword last, numbered parts in between)
  const preface = sorted.filter((c) => c.part === 0 && c.order === 0)
  const afterword = sorted.filter((c) => c.part === 0 && c.order > 0)
  const numbered = sorted.filter((c) => c.part > 0)

  const partMap = new Map<number, typeof numbered>()
  for (const ch of numbered) {
    if (!partMap.has(ch.part)) partMap.set(ch.part, [])
    partMap.get(ch.part)!.push(ch)
  }
  const partEntries = Array.from(partMap.entries()).sort((a, b) => a[0] - b[0])

  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: guide.title,
    description: guide.description,
    author: { '@type': 'Person', name: guide.author, url: SITE_URL },
    url: `${SITE_URL}/guide/${guideSlug}`,
    inLanguage: 'en-US',
    numberOfPages: guide.chapters.length,
    genre: 'Technology',
    datePublished: guide.date,
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Guide', url: `${SITE_URL}/guide` },
          { name: guide.title, url: `${SITE_URL}/guide/${guideSlug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px', fontFamily: 'var(--font-sans)' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link
            href="/blog"
            style={{
              fontSize: '13px',
              color: 'var(--accent)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 24,
            }}
          >
            &larr; Blog
          </Link>

          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 800,
              color: 'var(--accent)',
              lineHeight: 1.2,
              margin: '0 0 12px',
            }}
          >
            {guide.title}
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 24px' }}>
            {guide.subtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            <span>{guide.chapters.length} chapters</span>
            <span>{totalWords.toLocaleString()} words</span>
            <span>{totalReadingTime} min total read</span>
            <span>by {guide.author}</span>
          </div>
        </div>

        {/* Table of Contents */}
        <div>
          {/* Preface */}
          {preface.length > 0 && (
            <div className="guide-toc-part">
              {preface.map((ch) => (
                <ChapterRow key={ch.slug} ch={ch} guideSlug={guideSlug} />
              ))}
            </div>
          )}

          {/* Numbered parts */}
          {partEntries.map(([partNum, chs]) => (
            <div key={partNum} className="guide-toc-part">
              <div className="guide-toc-part-title">
                Part {partNum}: {chs[0].partTitle}
              </div>
              {chs.map((ch) => (
                <ChapterRow key={ch.slug} ch={ch} guideSlug={guideSlug} />
              ))}
            </div>
          ))}

          {/* Afterword */}
          {afterword.length > 0 && (
            <div className="guide-toc-part">
              {afterword.map((ch) => (
                <ChapterRow key={ch.slug} ch={ch} guideSlug={guideSlug} />
              ))}
            </div>
          )}
        </div>

        {/* GitHub CTA */}
        <GitHubCTA repoUrl={guide.githubUrl} />
      </div>
    </>
  )
}

function ChapterRow({ ch, guideSlug }: { ch: { slug: string; title: string; subtitle: string; order: number }; guideSlug: string }) {
  return (
    <Link href={`/guide/${guideSlug}/${ch.slug}`} className="guide-toc-chapter">
      <span className="guide-toc-chapter-number">
        {ch.order === 0 ? '' : ch.order === 11 ? '' : `${String(ch.order).padStart(2, '0')}`}
      </span>
      <span className="guide-toc-chapter-title">{ch.title}</span>
      <span className="guide-toc-chapter-subtitle">{ch.subtitle}</span>
    </Link>
  )
}
