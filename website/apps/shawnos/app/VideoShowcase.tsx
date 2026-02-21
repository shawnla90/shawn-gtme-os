'use client'

import { useState, useRef, useCallback } from 'react'

/**
 * Click-to-play video showcase in terminal chrome.
 * Shows a styled poster with play button. Clicking plays the video inline.
 * Video stays on the page — no navigation, no modal.
 */
export function VideoShowcase() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setIsPlaying(true)
    video.play().catch(() => setIsPlaying(false))
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
      {/* Terminal chrome title bar */}
      <div style={titleBar}>
        <div style={trafficLights}>
          <span style={{ ...dot, background: '#E05555' }} />
          <span style={{ ...dot, background: '#D2A53C' }} />
          <span style={{ ...dot, background: '#4EC373' }} />
        </div>
        <span style={titleText}>./highlight-reel.mp4</span>
      </div>

      {/* Video container */}
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
          preload="metadata"
        >
          <source src="/video/lead-magnet.mp4" type="video/mp4" />
        </video>

        {/* Poster overlay — visible when not playing */}
        {!isPlaying && (
          <div style={overlay}>
            <div style={posterContent}>
              <div style={playIcon}>▶</div>
              <div style={posterTitle}>190+ free knowledge entries</div>
              <div style={posterSubtitle}>60s highlight reel — click to play</div>
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
  gap: 16,
}

const playIcon: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: '50%',
  border: '2px solid var(--accent)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 24,
  color: 'var(--accent)',
  transition: 'transform 0.15s ease, background 0.15s ease',
}

const posterTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--text-primary)',
  textAlign: 'center',
}

const posterSubtitle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--text-muted)',
}
