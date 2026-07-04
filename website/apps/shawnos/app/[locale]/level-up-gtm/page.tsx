import type { Metadata } from 'next'
import path from 'path'
import fs from 'fs'
import { setRequestLocale } from 'next-intl/server'
import { getAllPosts } from '@shawnos/shared/lib'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { Link } from '../../../i18n/navigation'

const CONTENT_BASE = path.join(process.cwd(), '../../../content/website/final')

// TODO: swap for the Beehiiv subscribe URL when Shawn provides it
const SUBSCRIBE_URL = 'https://clearbox.to'

function getContentDir(locale: string) {
  const localeDir = path.join(CONTENT_BASE, locale)
  if (locale !== 'en' && fs.existsSync(localeDir)) return localeDir
  return CONTENT_BASE
}

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Level Up GTM | shawnos.ai'
  const description =
    'The weekly GTM show. Reddit-mined value for operators: prospecting tool of the week, what worked, what faceplanted, and the threads worth your time. New episode every Friday.'
  return {
    title,
    description,
    alternates: {
      canonical: 'https://shawnos.ai/level-up-gtm',
      languages: hreflang('/level-up-gtm'),
    },
    openGraph: {
      title,
      description,
      url: 'https://shawnos.ai/level-up-gtm',
      images: [{ url: '/og?title=Level+Up+GTM&subtitle=the+weekly+gtm+show', width: 1200, height: 630 }],
    },
    twitter: { title, description, images: ['/og?title=Level+Up+GTM&subtitle=the+weekly+gtm+show'] },
  }
}

type Props = {
  params: Promise<{ locale: string }>
}

export default async function LevelUpGtmPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const episodes = getAllPosts(getContentDir(locale))
    .filter((p) => p.category === 'level-up-gtm')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const latest = episodes[0]
  const archive = episodes.slice(1)

  const card: React.CSSProperties = {
    padding: '24px',
    background: 'var(--canvas-subtle)',
    border: '1px solid var(--canvas-border)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    display: 'block',
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Level Up GTM',
    url: 'https://shawnos.ai/level-up-gtm',
    description:
      'The weekly GTM show. Reddit-mined value for operators, every Friday.',
    author: { '@type': 'Person', name: 'Shawn Tenam', url: 'https://shawnos.ai' },
    numberOfItems: episodes.length,
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Level Up GTM', url: 'https://shawnos.ai/level-up-gtm' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <section className="full-bleed" style={{ padding: '72px 24px 12px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(34px, 5vw, 54px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--text-primary)',
              margin: '0 0 10px',
            }}
          >
            Level Up GTM
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0, maxWidth: 560 }}>
            The weekly GTM show, mined from the lead-gen and GTM engineering subreddits.
            Prospecting tool of the week, what worked, what faceplanted, and the thread
            where operators actually helped someone. Powered by Clearbox.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                border: '1px solid var(--canvas-border)',
                borderRadius: 'var(--radius-pill)',
                padding: '3px 10px',
              }}
            >
              weekly · fridays
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {episodes.length} episodes
            </span>
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-muted)',
                textDecoration: 'none',
                border: '1px solid var(--canvas-border)',
                borderRadius: 'var(--radius-pill)',
                padding: '3px 9px',
              }}
            >
              get it by email
            </a>
          </div>
        </div>
      </section>

      <section style={{ padding: '32px 24px 96px', maxWidth: 960, margin: '0 auto' }}>
        {episodes.length === 0 ? (
          <div
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 13,
              background: 'var(--canvas-subtle)',
              border: '1px solid var(--canvas-border)',
              borderRadius: 'var(--radius-lg)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            episode 001 is in the pipeline. it drops on the newsletter first, then lands here.
          </div>
        ) : (
          <>
            {latest && (
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    marginBottom: 12,
                  }}
                >
                  Latest
                </div>
                <Link href={`/blog/${latest.slug}`} style={card}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 8 }}>
                    {latest.title}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 12 }}>
                    {latest.excerpt}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <time dateTime={latest.date} style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {latest.date}
                    </time>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      read →
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {archive.length > 0 && (
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: 16,
                  }}
                >
                  Archive
                </div>
                {archive.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--canvas-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                      textDecoration: 'none',
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4, flex: 1 }}>
                      {post.title}
                    </span>
                    <time dateTime={post.date} style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {post.date}
                    </time>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
