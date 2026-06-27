import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { BreadcrumbSchema } from '@shawnos/shared/components'
import { hreflang } from '../../../i18n/hreflang'
import { getYouTubeUploads, YT_HANDLE_URL } from './youtube'
import { WatchGallery } from './WatchGallery'

export const revalidate = 3600

const SITE_URL = 'https://shawnos.ai'
const TIKTOK_URL = 'https://www.tiktok.com/@shawnos.ai'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Watch — building in public, on camera'
  const description =
    'Short, real clips from the build: Claude Code, context engineering, GTM systems. New uploads pull straight from YouTube. The same builds live on TikTok too.'
  return {
    title,
    description,
    keywords: ['build in public video', 'Claude Code shorts', 'GTM engineering youtube', 'vibe coding tiktok', 'shawnos'],
    alternates: { canonical: `${SITE_URL}/watch`, languages: hreflang('/watch') },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/watch`,
      images: [{ url: `/og?title=${encodeURIComponent('Watch')}&subtitle=${encodeURIComponent('building in public, on camera')}`, width: 1200, height: 630 }],
    },
    twitter: {
      title,
      description,
      images: [`/og?title=${encodeURIComponent('Watch')}&subtitle=${encodeURIComponent('building in public, on camera')}`],
    },
  }
}

export default async function WatchPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const videos = await getYouTubeUploads()

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Watch', url: `${SITE_URL}/watch` }]} />
      <style>{`
        .watch { max-width: 1040px; margin: 0 auto; padding: 56px 24px 110px; font-family: var(--font-sans); }
        .watch-kicker { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-muted); margin: 0 0 14px; }
        .watch-h1 { font-size: clamp(36px, 5.5vw, 60px); font-weight: 700; line-height: 1.04; letter-spacing: -0.03em;
          color: var(--text-primary); margin: 0 0 18px; }
        .watch-lead { font-size: 17px; color: var(--text-secondary); line-height: 1.6; max-width: 640px; margin: 0; }
        .watch-section { margin-top: 56px; }
        .watch-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 22px; }
        .watch-h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em; margin: 0; }
        .watch-out { font-size: 14px; font-weight: 600; color: var(--text-primary); text-decoration: none; }
        .watch-out:hover { opacity: 0.7; }

        .tiktok-panel { display: flex; align-items: center; gap: 22px; flex-wrap: wrap;
          background: var(--canvas-subtle); border: 1px solid var(--canvas-border); border-radius: var(--radius-lg);
          padding: 28px 30px; }
        .tiktok-copy { flex: 1; min-width: 240px; }
        .tiktok-handle { font-family: var(--font-mono); font-size: 14px; color: var(--text-primary); font-weight: 600; margin: 0 0 6px; }
        .tiktok-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.55; margin: 0; }
        .tiktok-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600;
          text-decoration: none; padding: 11px 22px; border-radius: var(--radius-pill);
          background: var(--text-primary); color: var(--text-on-accent); white-space: nowrap; transition: opacity 0.15s ease; }
        .tiktok-btn:hover { opacity: 0.82; }
      `}</style>

      <div className="watch">
        <header>
          <p className="watch-kicker">// watch</p>
          <h1 className="watch-h1">Building in public, on camera.</h1>
          <p className="watch-lead">
            Short, real clips from inside the build — Claude Code, context engineering, GTM systems, the wins and the
            mess. New uploads pull straight from the channel, so this stays current on its own.
          </p>
        </header>

        <section className="watch-section">
          <div className="watch-head">
            <h2 className="watch-h2">YouTube{videos.length > 0 ? ` · ${videos.length} recent` : ''}</h2>
            <a className="watch-out" href={YT_HANDLE_URL} target="_blank" rel="noopener noreferrer">Subscribe on YouTube →</a>
          </div>
          <WatchGallery videos={videos} />
        </section>

        <section className="watch-section">
          <div className="watch-head">
            <h2 className="watch-h2">TikTok</h2>
          </div>
          <div className="tiktok-panel">
            <div className="tiktok-copy">
              <p className="tiktok-handle">@shawnos.ai</p>
              <p className="tiktok-desc">
                The same builds in vertical, fast-cut form. Shorts drop on TikTok first — follow along there.
              </p>
            </div>
            <a className="tiktok-btn" href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
              Watch on TikTok →
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
