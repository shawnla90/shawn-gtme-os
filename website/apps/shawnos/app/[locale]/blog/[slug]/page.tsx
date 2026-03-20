import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { getTranslations } from 'next-intl/server'
import { getPostSlugs, getPostBySlug, markdownToHtml, extractFAQs } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../../i18n/hreflang'
import { Link } from '../../../../i18n/navigation'
import { locales } from '../../../../i18n/config'
import { TableOfContents } from './TableOfContents'
import { ArticleReveal, HeaderReveal } from './ArticleReveal'
import { BlogTracking } from './BlogTracking'

const GREEN = '#4EC373'
const GREEN_DIM = '#4EC37344'

const CLAUDE_ART = `██████╗ ██╗       █████╗  ██╗   ██╗ ██████╗  ███████╗
██╔════╝ ██║      ██╔══██╗ ██║   ██║ ██╔══██╗ ██╔════╝
██║      ██║      ███████║ ██║   ██║ ██║  ██║ █████╗
██║      ██║      ██╔══██║ ██║   ██║ ██║  ██║ ██╔══╝
╚██████╗ ███████╗ ██║  ██║ ╚██████╔╝ ██████╔╝ ███████╗
 ╚═════╝ ╚══════╝ ╚═╝  ╚═╝  ╚═════╝  ╚═════╝  ╚══════╝`

const DAILY_ART = `██████╗   █████╗  ██╗ ██╗      ██╗   ██╗
██╔══██╗ ██╔══██╗ ██║ ██║      ╚██╗ ██╔╝
██║  ██║ ███████║ ██║ ██║       ╚████╔╝
██║  ██║ ██╔══██║ ██║ ██║        ╚██╔╝
██████╔╝ ██║  ██║ ██║ ███████╗    ██║
╚═════╝  ╚═╝  ╚═╝ ╚═╝ ╚══════╝    ╚═╝`

const C_ART = ` ██████╗
██╔════╝
██║
██║
╚██████╗
 ╚═════╝`

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
      modifiedTime: post.date,
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
  const htmlContent = await markdownToHtml(post.content)
  const faqs = extractFAQs(post.content)

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
    dateModified: post.date,
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

      {/*
        Outer wrapper: on desktop becomes a flex row (content + toc sidebar).
        The TableOfContents component renders BOTH a .toc-mobile and .toc-desktop
        element internally; CSS shows only the appropriate one per breakpoint.
        We position it as the second flex child so it appears on the right.
      */}
      <div className="blog-post-layout">
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
              color: post.category === 'claude-daily' ? GREEN : 'var(--accent)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 24,
            }}
          >
            &larr; {post.category === 'claude-daily' ? 'Claude Code Daily' : t('backToBlog')}
          </Link>

          {post.category === 'claude-daily' && (
            <div
              style={{
                padding: '28px 24px',
                marginBottom: '28px',
                background: '#0d1117',
                border: `1px solid ${GREEN_DIM}`,
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* top accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)`,
                }}
              />

              {/* logo + mascot row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                {/* left: CLAUDE + DAILY block art */}
                <div style={{ minWidth: 0 }}>
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 'clamp(5px, 1.4vw, 8px)',
                      lineHeight: 1.15,
                      letterSpacing: '0.02em',
                      whiteSpace: 'pre',
                      margin: 0,
                      padding: 0,
                      userSelect: 'none',
                      color: GREEN,
                      textShadow: `0 0 20px #4EC37330, 0 0 4px #4EC37320`,
                    }}
                  >
                    {CLAUDE_ART}
                  </pre>
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 'clamp(5px, 1.4vw, 8px)',
                      lineHeight: 1.15,
                      letterSpacing: '0.02em',
                      whiteSpace: 'pre',
                      margin: 0,
                      padding: 0,
                      userSelect: 'none',
                      color: GREEN,
                      textShadow: `0 0 20px #4EC37330, 0 0 4px #4EC37320`,
                      marginTop: '-1px',
                    }}
                  >
                    {DAILY_ART}
                  </pre>
                </div>

                {/* right: CC mascot */}
                <div
                  className="cc-article-mascot"
                  style={{
                    flexShrink: 0,
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: '#161b22',
                      border: '1px solid #4EC37315',
                      boxShadow: '0 0 30px #4EC37310',
                    }}
                  />
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      lineHeight: 1.15,
                      whiteSpace: 'pre',
                      margin: 0,
                      padding: 0,
                      userSelect: 'none',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-58%, -62%)',
                      fontSize: '8px',
                      color: GREEN,
                      textShadow: `0 0 16px #4EC37340`,
                    }}
                  >
                    {C_ART}
                  </pre>
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      lineHeight: 1.15,
                      whiteSpace: 'pre',
                      margin: 0,
                      padding: 0,
                      userSelect: 'none',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-38%, -38%)',
                      fontSize: '8px',
                      color: '#6FD98F',
                      textShadow: `0 0 16px #4EC37340`,
                    }}
                  >
                    {C_ART}
                  </pre>
                </div>
              </div>

              {/* meta row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '14px',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: GREEN,
                    border: `1px solid ${GREEN_DIM}`,
                    borderRadius: '10px',
                    padding: '3px 10px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  live
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  the daily show for claude code builders
                </span>
              </div>

              {/* divider */}
              <div
                style={{
                  height: '1px',
                  background: `linear-gradient(90deg, ${GREEN}20, ${GREEN}40, ${GREEN}20)`,
                  margin: '14px 0',
                }}
              />

              {/* section nav */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                {[
                  'the pulse', 'hottest thread', 'repo of the day',
                  'best comment', 'troll of the day', 'fun facts',
                  'code drop', 'scoreboard',
                ].map((label) => (
                  <a
                    key={label}
                    href={`#${label.replace(/\s+/g, '-')}`}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      padding: '3px 10px',
                      borderRadius: '4px',
                      background: '#ffffff06',
                      border: '1px solid #ffffff0a',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>

              {/* bottom accent line */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${GREEN_DIM}, transparent)`,
                }}
              />
            </div>
          )}

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
                  color: post.category === 'claude-daily' ? GREEN : 'var(--accent)',
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

          <footer
            style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: `1px solid ${post.category === 'claude-daily' ? GREEN_DIM : 'var(--border)'}`,
            }}
          >
            <Link
              href={post.category === 'claude-daily' ? '/claude-daily' : '/blog'}
              style={{
                fontSize: '13px',
                color: post.category === 'claude-daily' ? GREEN : 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              &larr; {post.category === 'claude-daily' ? 'back to Claude Code Daily' : t('backToBlog')}
            </Link>
          </footer>
        </article>

        {/* Desktop sidebar TOC — hidden on mobile via CSS */}
        <TableOfContents html={htmlContent} desktopOnly />
      </div>
    </>
  )
}
