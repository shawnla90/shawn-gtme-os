import type { Metadata } from 'next'
import path from 'path'
import { notFound } from 'next/navigation'
import {
  getGuideBySlug,
  getAllGuides,
  getChapterBySlug,
  getAdjacentChapters,
  getChapterIndex,
} from '@shawnos/shared/data/guide-manifest'
import { getPostBySlug, markdownToHtml } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { ChapterNav } from './ChapterNav'
import { ChapterProgress } from './ChapterProgress'
import { GuideTableOfContents } from './GuideTableOfContents'
import { GitHubCTA } from '../GitHubCTA'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_BASE = path.join(process.cwd(), '../../../content/guides')

export function generateStaticParams() {
  const params: { guide: string; chapter: string }[] = []
  for (const g of getAllGuides()) {
    for (const ch of g.chapters) {
      params.push({ guide: g.slug, chapter: ch.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guide: string; chapter: string }>
}): Promise<Metadata> {
  const { guide: guideSlug, chapter: chapterSlug } = await params
  const guide = getGuideBySlug(guideSlug)
  const chapter = getChapterBySlug(guideSlug, chapterSlug)
  if (!guide || !chapter) return {}

  const url = `${SITE_URL}/guide/${guideSlug}/${chapterSlug}`
  const ogImage = `/og?title=${encodeURIComponent(chapter.title)}&subtitle=${encodeURIComponent(guide.title)}`

  return {
    title: `${chapter.title} | ${guide.title}`,
    description: chapter.subtitle,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: chapter.title,
      description: chapter.subtitle,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: chapter.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${chapter.title} | ${guide.title}`,
      description: chapter.subtitle,
      images: [ogImage],
    },
  }
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ guide: string; chapter: string }>
}) {
  const { guide: guideSlug, chapter: chapterSlug } = await params
  const guide = getGuideBySlug(guideSlug)
  const chapter = getChapterBySlug(guideSlug, chapterSlug)
  if (!guide || !chapter) notFound()

  const guideContentDir = path.join(CONTENT_BASE, guideSlug)
  const post = getPostBySlug(chapterSlug, guideContentDir)
  const htmlContent = await markdownToHtml(post.content)

  const { prev, next } = getAdjacentChapters(guideSlug, chapterSlug)
  const { current, total } = getChapterIndex(guideSlug, chapterSlug)

  const allChapters = guide.chapters.map((c) => ({
    slug: c.slug,
    title: c.title,
    order: c.order,
  }))

  const chapterSchema = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: chapter.title,
    description: chapter.subtitle,
    position: chapter.order,
    url: `${SITE_URL}/guide/${guideSlug}/${chapterSlug}`,
    isPartOf: {
      '@type': 'Book',
      name: guide.title,
      author: { '@type': 'Person', name: guide.author, url: SITE_URL },
      url: `${SITE_URL}/guide/${guideSlug}`,
    },
    author: { '@type': 'Person', name: guide.author, url: SITE_URL },
    wordCount: post.wordCount,
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Guide', url: `${SITE_URL}/guide` },
          { name: guide.title, url: `${SITE_URL}/guide/${guideSlug}` },
          { name: chapter.title, url: `${SITE_URL}/guide/${guideSlug}/${chapterSlug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterSchema) }}
      />

      <div className="guide-chapter-layout">
        <article className="guide-chapter-content" style={{ fontFamily: 'var(--font-sans)' }}>
          <ChapterProgress guideSlug={guideSlug} current={current} total={total} />

          {/* Mobile TOC */}
          <GuideTableOfContents
            html={htmlContent}
            guideSlug={guideSlug}
            currentChapterSlug={chapterSlug}
            allChapters={allChapters}
            mobileOnly
          />

          <header style={{ marginBottom: 32 }}>
            {chapter.partTitle && chapter.part > 0 && (
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                Part {chapter.part}: {chapter.partTitle}
              </span>
            )}

            <h1
              style={{
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 700,
                color: 'var(--accent)',
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {chapter.title}
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {guide.author}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {post.readingTime} min read
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {post.wordCount.toLocaleString()} words
              </span>
            </div>
          </header>

          <div
            className="guide-prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <GitHubCTA
            repoUrl={guide.githubUrl}
            chapterPath={chapter.githubPath}
          />

          <ChapterNav
            guideSlug={guideSlug}
            prev={prev ? { slug: prev.slug, title: prev.title, partTitle: prev.partTitle } : null}
            next={next ? { slug: next.slug, title: next.title, partTitle: next.partTitle } : null}
          />
        </article>

        {/* Desktop sidebar TOC */}
        <GuideTableOfContents
          html={htmlContent}
          guideSlug={guideSlug}
          currentChapterSlug={chapterSlug}
          allChapters={allChapters}
          desktopOnly
        />
      </div>
    </>
  )
}
