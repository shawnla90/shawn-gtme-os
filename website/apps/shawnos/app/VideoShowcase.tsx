'use client'

import { useRef, useEffect, useState } from 'react'

export function VideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // IntersectionObserver for scroll-based autoplay
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        const video = videoRef.current
        if (!video) return
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Set playback rate
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 1.2
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ ...container, opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease' }}
    >
      <video
        ref={videoRef}
        style={videoEl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/video/lead-magnet.mp4" type="video/mp4" />
      </video>
    </div>
  )
}

/* ── styles ── */

const container: React.CSSProperties = {
  borderRadius: 8,
  border: '1px solid var(--border)',
  overflow: 'hidden',
  fontFamily: 'var(--font-mono)',
}

const videoEl: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  aspectRatio: '16 / 9',
}
