'use client'

import { useState } from 'react'

interface ShortEmbedProps {
  videoId: string
  title: string
}

export function ShortEmbed({ videoId, title }: ShortEmbedProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      style={{
        maxWidth: 320,
        aspectRatio: '9 / 16',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: '#000',
      }}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
          style={{
            width: '100%',
            height: '100%',
            padding: 0,
            border: 0,
            cursor: 'pointer',
            display: 'block',
            position: 'relative',
            background: '#000',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.92 }}
          />
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.62)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              paddingLeft: 4,
              backdropFilter: 'blur(2px)',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            &#9654;
          </span>
        </button>
      )}
    </div>
  )
}
