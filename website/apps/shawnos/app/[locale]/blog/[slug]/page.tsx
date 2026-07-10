import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { getTranslations } from 'next-intl/server'
import { getPostSlugs, getPostBySlug, markdownToHtml, extractFAQs } from '@shawnos/shared/lib'
import { withYouTubeEmbeds } from '../../../../lib/youtube-embed'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../../i18n/hreflang'
import { Link } from '../../../../i18n/navigation'
import { locales } from '../../../../i18n/config'
import { TableOfContents } from './TableOfContents'
import { ArticleReveal, HeaderReveal } from './ArticleReveal'
import { BlogTracking } from './BlogTracking'
import { QuickstartTerminal } from '../../../../components/blog/QuickstartTerminal'
import { ClearboxDailyHero } from '../../../components/clearbox-aura/ClearboxDailyHero'
import { ClearboxReadingRails } from '../../../components/clearbox-aura/ClearboxReadingRails'
import { ClearboxPipelineFinale } from '../../../components/clearbox-aura/ClearboxPipelineFinale'
import { DigestHighlights } from '../../../components/clearbox-aura/DigestHighlights'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_BASE = path.join(process.cwd(), '../../../content/website/final')

function getContentDir(locale: string, slug?: string) {
  if (locale !== 'en') {
    const localeDir = path.join(CONTENT_BASE, locale)
    if (slug) {
      const localeFile = path.join(localeDir, `${slug}.md`)
      if (fs.existsSync(localeFile)) return localeDir
    } else if (fs.existsSync(localeDir)) {
      return localeDir
    }
  }
  return CONTENT_BASE
}

export function generateStaticParams() {
  const slugs = getPostSlugs(CONTENT_BASE)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug, CONTENT_BASE)
  const postUrl = `${SITE_URL}/blog/${slug}`
  const ogImage = `/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt)}`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postUrl, languages: hreflang(`/blog/${slug}`) },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      publishedTime: post.date,
      modifiedTime: post.updated || post.dateModified || post.date,
      section: post.category,
      authors: ['Shawn Tenam'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  }
}

const localeMap: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  he: 'he-IL',
  zh: 'zh-CN',
  ja: 'ja-JP',
}

function formatDate(dateStr: string, locale = 'en'): string {
  if (!dateStr) return dateStr
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString(localeMap[locale] || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const t = await getTranslations('Blog')
  const contentDir = getContentDir(locale, slug)
  const post = getPostBySlug(slug, contentDir)
  let htmlContent = withYouTubeEmbeds(await markdownToHtml(post.content))
  if (post.category === 'claude-daily') {
    // ==phrase== markers → inline highlight spans (rough-notation targets).
    // Applied after markdownToHtml so the sanitizer doesn't strip it (GFM ignores ==).
    htmlContent = htmlContent.replace(/==([^=\n]{2,80})==/g, '<span class="cb-hl">$1</span>')
  }
  const faqs = extractFAQs(post.content)

  // {{quickstart-terminal}} on its own line becomes an interactive island; split
  // the rendered HTML into the halves that bracket the <QuickstartTerminal/>.
  const quickstartParts = htmlContent.split(
    /<p>\s*(?:\{|&#123;){2}quickstart-terminal(?:\}|&#125;){2}\s*<\/p>/,
  )
  const hasQuickstart = quickstartParts.length > 1
  // TOC only needs headings — hand it the marker-free html (rejoined split halves).
  const tocHtml = quickstartParts.join('')

  const postUrl = `${SITE_URL}/blog/${slug}`
  const ogImage = `${SITE_URL}/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt)}`

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated || post.dateModified || post.date,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    mainEntityOfPage: postUrl,
    url: postUrl,
    image: ogImage,
    wordCount: post.wordCount,
    inLanguage: localeMap[locale] || 'en-US',
    ...(post.category && { articleSection: post.category }),
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: post.title,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.blog-post-content h1', '.blog-post-content .prose'],
    },
    url: postUrl,
  }

  return (
    <>
      <BlogTracking slug={post.slug} title={post.title} />
      <BreadcrumbSchema
        items={[
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${slug}` },
        ]}
      />

      {/* Daily editions only: typed hero + pinned scraper/aura rails flanking the read. */}
      {post.category === 'claude-daily' && (
        <>
          <ClearboxDailyHero />
          <ClearboxReadingRails />
        </>
      )}

      {/*
        Outer wrapper: on desktop becomes a flex row (content + toc sidebar).
        The TableOfContents component renders BOTH a .toc-mobile and .toc-desktop
        element internally; CSS shows only the appropriate one per breakpoint.
        We position it as the second flex child so it appears on the right.
      */}
      <div className={`blog-post-layout${post.category === 'claude-daily' ? ' blog-post-wide' : ''}`}>
        {/* Main content column */}
        <article className="blog-post-content" style={{ fontFamily: 'var(--font-sans)' }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
          />
          {faqSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
          )}

          <Link
            href={post.category === 'claude-daily' ? '/claude-daily' : '/blog'}
            style={{
              fontSize: '13px',
              color: post.category === 'claude-daily' ? 'var(--text-primary)' : 'var(--accent)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 24,
            }}
          >
            &larr; {post.category === 'claude-daily' ? 'Claude Code Daily' : t('backToBlog')}
          </Link>


          {/*
            Mobile TOC strip lives here inside the article column, above the
            header. On desktop this element is hidden by CSS and the sidebar
            aside (below) is shown instead.
          */}
          <TableOfContents html={tocHtml} mobileOnly />

          <HeaderReveal>
            <header style={{ marginBottom: 32 }}>
              <h1
                style={{
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: 700,
                  color: post.category === 'claude-daily' ? 'var(--text-primary)' : 'var(--accent)',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {post.title}
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
                  Shawn Tenam
                </span>

                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>·</span>

                <time
                  dateTime={post.date}
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                  }}
                >
                  {formatDate(post.date, locale)}
                </time>

                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>·</span>

                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {t('minRead', { minutes: post.readingTime })}
                </span>

                {post.category && (
                  <>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>·</span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                        borderRadius: '3px',
                        padding: '1px 6px',
                        letterSpacing: '0.4px',
                        opacity: 0.75,
                      }}
                    >
                      {post.category}
                    </span>
                  </>
                )}
              </div>
            </header>
          </HeaderReveal>

          <ArticleReveal>
            {hasQuickstart ? (
              <>
                <div className="prose" dangerouslySetInnerHTML={{ __html: quickstartParts[0] }} />
                <QuickstartTerminal />
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: quickstartParts.slice(1).join('') }}
                />
              </>
            ) : (
              <div className="prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            )}
          </ArticleReveal>

          {post.category === 'claude-daily' && <DigestHighlights />}

          <footer
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: `1px solid ${post.category === 'claude-daily' ? 'color-mix(in srgb, var(--text-primary) 27%, transparent)' : 'var(--border)'}`,
            }}
          >
            <Link
              href={post.category === 'claude-daily' ? '/claude-daily' : '/blog'}
              style={{
                fontSize: '13px',
                color: post.category === 'claude-daily' ? 'var(--text-primary)' : 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              &larr; {post.category === 'claude-daily' ? 'back to Claude Code Daily' : t('backToBlog')}
            </Link>
          </footer>
        </article>

        {/* Desktop sidebar TOC — hidden on mobile via CSS */}
        {post.category !== 'claude-daily' && <TableOfContents html={tocHtml} desktopOnly />}
      </div>

      {/* Daily editions only: full-width pipeline finale + CTA. */}
      {post.category === 'claude-daily' && <ClearboxPipelineFinale />}
    </>
  )
}
