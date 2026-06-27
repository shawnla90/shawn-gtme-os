'use client'

import { useState } from 'react'
import type { YouTubeVideo } from './youtube'

function fmtViews(n?: number): string {
  if (n == null) return ''
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K views`
  return `${n} views`
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function WatchGallery({ videos }: { videos: YouTubeVideo[] }) {
  const [active, setActive] = useState<string | null>(null)

  if (videos.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
        Feed is catching its breath — new uploads land here automatically.
      </p>
    )
  }

  return (
    <>
      <style>{`
        .watch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .watch-card { display: flex; flex-direction: column; }
        .watch-media { position: relative; aspect-ratio: 16 / 9; border-radius: var(--radius-md); overflow: hidden;
          border: 1px solid var(--canvas-border); background: #000; }
        .watch-thumb { width: 100%; height: 100%; padding: 0; border: 0; cursor: pointer; display: block; position: relative; background: #000; }
        .watch-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.92;
          transition: opacity 0.18s ease, transform 0.18s ease; }
        .watch-thumb:hover img { opacity: 1; transform: scale(1.03); }
        .watch-play { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: 56px; height: 56px; border-radius: 50%; background: rgba(0,0,0,0.62); color: #fff;
          display: flex; align-items: center; justify-content: center; font-size: 20px; padding-left: 4px;
          backdrop-filter: blur(2px); border: 1px solid rgba(255,255,255,0.25); transition: background 0.18s ease; }
        .watch-thumb:hover .watch-play { background: rgba(0,0,0,0.8); }
        .watch-frame { width: 100%; height: 100%; border: 0; display: block; }
        .watch-title { font-size: 14px; font-weight: 600; color: var(--text-primary); line-height: 1.4; margin: 12px 0 4px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .watch-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin: 0;
          letter-spacing: 0.04em; }
      `}</style>

      <div className="watch-grid">
        {videos.map((v) => (
          <article key={v.id} className="watch-card">
            <div className="watch-media">
              {active === v.id ? (
                <iframe
                  className="watch-frame"
                  src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button type="button" className="watch-thumb" onClick={() => setActive(v.id)} aria-label={`Play: ${v.title}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
                  <span className="watch-play" aria-hidden>▶</span>
                </button>
              )}
            </div>
            <p className="watch-title">{v.title}</p>
            <p className="watch-sub">{[fmtDate(v.published), fmtViews(v.views)].filter(Boolean).join(' · ')}</p>
          </article>
        ))}
      </div>
    </>
  )
}
