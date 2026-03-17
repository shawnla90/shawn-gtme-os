import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { getTranslations } from 'next-intl/server'
import { getPostSlugs, getPostBySlug, markdownToHtml } from '@shawnos/shared/lib'
import { BreadcrumbSchema, ScrollSignup } from '@shawnos/shared/components'
import { hreflang } from '../../../../i18n/hreflang'
import { Link } from '../../../../i18n/navigation'
import { locales } from '../../../../i18n/config'
import { TableOfContents } from './TableOfContents'
import { ArticleReveal, HeaderReveal } from './ArticleReveal'
import { BlogTracking } from './BlogTracking'

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
  const htmlContent = await markdownToHtml(post.content)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Shawn Tenam', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    url: `${SITE_URL}/blog/${slug}`,
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

      {/*
        Outer wrapper: on desktop becomes a flex row (content + toc sidebar).
        The TableOfContents component renders BOTH a .toc-mobile and .toc-desktop
        element internally; CSS shows only the appropriate one per breakpoint.
        We position it as the second flex child so it appears on the right.
      */}
      <div className="blog-post-layout">
        {/* Main content column */}
        <article className="blog-post-content" style={{ fontFamily: 'var(--font-mono)' }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />

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
            &larr; {t('backToBlog')}
          </Link>

          {/*
            Mobile TOC strip lives here inside the article column, above the
            header. On desktop this element is hidden by CSS and the sidebar
            aside (below) is shown instead.
          */}
          <TableOfContents html={htmlContent} mobileOnly />

          <HeaderReveal>
            <header style={{ marginBottom: 32 }}>
              <h1
                style={{
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: 700,
                  color: 'var(--accent)',
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
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </ArticleReveal>

          <ScrollSignup />

          <footer
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: '1px solid var(--border)',
            }}
          >
            <Link
              href="/blog"
              style={{
                fontSize: '13px',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              &larr; {t('backToBlog')}
            </Link>
          </footer>
        </article>

        {/* Desktop sidebar TOC — hidden on mobile via CSS */}
        <TableOfContents html={htmlContent} desktopOnly />
      </div>
    </>
  )
}
