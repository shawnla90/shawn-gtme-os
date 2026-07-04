import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getTimelineItems, getAllPosts } from '@shawnos/shared/lib'
import { BreadcrumbSchema, PostCard } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { BlogTimeline } from './BlogTimeline'

export const revalidate = 60

const CONTENT_BASE = path.join(process.cwd(), '../../../content/website/final')

function getContentDir(locale: string) {
  const localeDir = path.join(CONTENT_BASE, locale)
  if (locale !== 'en' && fs.existsSync(localeDir)) return localeDir
  return CONTENT_BASE
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Blog')
  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    alternates: { canonical: 'https://shawnos.ai/blog', languages: hreflang('/blog') },
    openGraph: {
      title: 'Blog | shawnos.ai',
      description: t('metadata.description'),
      url: 'https://shawnos.ai/blog',
      images: [{ url: '/og?title=Blog&subtitle=Posts+from+the+build+log', width: 1200, height: 630 }],
    },
    twitter: {
      title: 'Blog | shawnos.ai',
      description: t('metadata.description'),
      images: ['/og?title=Blog&subtitle=Posts+from+the+build+log'],
    },
  }
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function BlogIndex({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const blogHrefBase = locale === 'en' ? '/blog' : `/${locale}/blog`
  const contentDir = getContentDir(locale)
  // no limit tight enough to cut the backdated posts; substack is retired
  const items = getTimelineItems({
    contentDir,
    blogHrefBase,
    limit: 400,
    excludeCategories: ['claude-daily'],
  }).filter((i) => i.source !== 'substack')

  // claude-daily recaps live on their own /claude-daily route — keep them out
  // of the main blog so the evergreen posts surface. Featured hero honors the
  // `featured:` frontmatter flag (newest first).
  const everyPost = getAllPosts(contentDir)
  const allPosts = everyPost.filter((p) => p.category !== 'claude-daily')
  const featuredPosts = allPosts.filter((p) => p.featured).slice(0, 3)
  const latestDaily = everyPost
    .filter((p) => p.category === 'claude-daily')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog',
    url: 'https://shawnos.ai/blog',
    description: 'Live feed of everything Shawn Tenam publishes — blog posts, Substack essays, Reddit threads.',
    author: { '@type': 'Person', name: 'Shawn Tenam', url: 'https://shawnos.ai' },
    numberOfItems: items.length,
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Blog', url: 'https://shawnos.ai/blog' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {latestDaily && (
        <section style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 0' }}>
          <a
            href="/claude-daily"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              border: '1px solid var(--canvas-border)',
              borderRadius: '12px',
              padding: '14px 20px',
              background: 'var(--canvas-subtle)',
              textDecoration: 'none',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--canvas-border)',
                  borderRadius: '999px',
                  padding: '3px 10px',
                }}
              >
                claude code daily
              </span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {latestDaily.title}
              </span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              latest episode →
            </span>
          </a>
        </section>
      )}
      {featuredPosts.length > 0 && (
        <section
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            padding: '32px 24px 0',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: '0 0 16px',
            }}
          >
            // featured
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            {featuredPosts.map((post) => (
              <div
                key={post.slug}
                style={{
                  border: '1px solid var(--canvas-border)',
                  borderRadius: '12px',
                  padding: '8px 20px 4px',
                  background: 'var(--canvas-subtle)',
                }}
              >
                <PostCard
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  slug={post.slug}
                  readingTime={post.readingTime}
                  category={post.category}
                  linkPrefix={blogHrefBase}
                />
              </div>
            ))}
          </div>
        </section>
      )}
      <BlogTimeline initialItems={items} />
    </>
  )
}
