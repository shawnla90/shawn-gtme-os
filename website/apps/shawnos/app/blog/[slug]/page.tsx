import type { Metadata } from 'next'
import path from 'path'
import { getPostSlugs, getPostBySlug, markdownToHtml } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { TableOfContents } from './TableOfContents'
import { ArticleReveal } from './ArticleReveal'

const SITE_URL = 'https://shawnos.ai'
const CONTENT_DIR = path.join(process.cwd(), '../../../content/website/final')

export function generateStaticParams() {
  const slugs = getPostSlugs(CONTENT_DIR)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug, CONTENT_DIR)
  const postUrl = `${SITE_URL}/blog/${slug}`
  const ogImage = `/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt)}`

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postUrl },
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

function formatDate(dateStr: string): string {
  if (!dateStr) return dateStr
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug, CONTENT_DIR)
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

          <a
            href="/blog"
            style={{
              fontSize: '13px',
              color: 'var(--accent)',
              textDecoration: 'none',
              display: 'inline-block',
              marginBottom: 24,
            }}
          >
            &larr; back to blog
          </a>

          {/*
            Mobile TOC strip lives here inside the article column, above the
            header. On desktop this element is hidden by CSS and the sidebar
            aside (below) is shown instead.
          */}
          <TableOfContents html={htmlContent} mobileOnly />

          <header style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: '28px',
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
              <time
                dateTime={post.date}
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}
              >
                {formatDate(post.date)}
              </time>

              <span style={{ fontSize: '13px', color: '#484F58' }}>·</span>

              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {post.readingTime} min read
              </span>

              {post.category && (
                <>
                  <span style={{ fontSize: '13px', color: '#484F58' }}>·</span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#4EC373',
                      border: '1px solid #4EC373',
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
              borderTop: '1px solid var(--border)',
            }}
          >
            <a
              href="/blog"
              style={{
                fontSize: '13px',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              &larr; back to blog
            </a>
          </footer>
        </article>

        {/* Desktop sidebar TOC — hidden on mobile via CSS */}
        <TableOfContents html={htmlContent} desktopOnly />
      </div>
    </>
  )
}
