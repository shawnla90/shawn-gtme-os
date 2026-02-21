'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { CONTENT_WIKI_ENTRIES } from '@shawnos/shared/data/content-wiki'
import { HOW_TO_WIKI_ENTRIES } from '@shawnos/shared/data/how-to-wiki'

export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { entryCount, entryLabel } = useMemo(() => {
    const total = CONTENT_WIKI_ENTRIES.length + HOW_TO_WIKI_ENTRIES.length
    const rounded = Math.floor(total / 10) * 10
    return {
      entryCount: `${rounded}+`,
      entryLabel: 'free playbooks, guides & how-tos',
    }
  }, [])

  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = 1.2
    video.muted = false
    video.currentTime = 0
    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        video.muted = true
        video.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false))
      })
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [])

  const handlePause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  return (
    <div style={container}>
      <div style={titleBar}>
        <div style={trafficLights}>
          <span style={{ ...dot, background: '#E05555' }} />
          <span style={{ ...dot, background: '#D2A53C' }} />
          <span style={{ ...dot, background: '#9B72CF' }} />
        </div>
        <span style={titleText}>./highlight-reel.mp4</span>
      </div>

      <div
        style={videoArea}
        onClick={isPlaying ? handlePause : handlePlay}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && (isPlaying ? handlePause() : handlePlay())}
      >
        <video
          ref={videoRef}
          onEnded={handleEnded}
          style={videoEl}
          playsInline
          preload="auto"
        >
          <source src="/video/highlight-reel.mp4" type="video/mp4" />
        </video>

        {!isPlaying && (
          <div style={overlay}>
            <div style={posterContent}>
              <div style={playIcon}>▶</div>
              <div style={posterCount}>{entryCount}</div>
              <div style={posterTitle}>{entryLabel}</div>
              <div style={posterGrowing}>and growing</div>
              <div style={posterSubtitle}>10s highlight reel — click to play</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── styles ── */

const container: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid var(--border)',
  overflow: 'hidden',
  fontFamily: 'var(--font-mono)',
  cursor: 'pointer',
}

const titleBar: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 16px',
  background: 'var(--canvas-subtle)',
  borderBottom: '1px solid var(--border)',
}

const trafficLights: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

const dot: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: '50%',
  display: 'inline-block',
}

const titleText: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
  color: 'var(--text-secondary)',
  fontSize: 13,
  userSelect: 'none',
}

const videoArea: React.CSSProperties = {
  position: 'relative',
  aspectRatio: '16 / 9',
  background: 'var(--canvas)',
  overflow: 'hidden',
}

const videoEl: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
}

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(13, 17, 23, 0.85)',
}

const posterContent: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
}

const playIcon: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  border: '2px solid var(--accent)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  color: 'var(--accent)',
  marginBottom: 8,
  transition: 'transform 0.15s ease, background 0.15s ease',
}

const posterCount: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 800,
  color: 'var(--text-primary)',
  textAlign: 'center',
  lineHeight: 1,
  letterSpacing: -2,
  textShadow: '0 0 30px rgba(155, 114, 207, 0.3)',
}

const posterTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--accent)',
  textAlign: 'center',
}

const posterGrowing: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-muted)',
  textAlign: 'center',
  letterSpacing: 2,
  textTransform: 'uppercase',
  marginBottom: 8,
}

const posterSubtitle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
  opacity: 0.7,
}
