import type { Metadata } from 'next'
import path from 'path'
import { getPostSlugs, getPostBySlug, markdownToHtml } from '@shawnos/shared/lib'

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
    <article
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'var(--font-mono)',
      }}
    >
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
        <time
          dateTime={post.date}
          style={{
            display: 'block',
            marginTop: 8,
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          {post.date}
        </time>
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

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
  )
}
