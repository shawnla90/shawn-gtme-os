'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Dot {
  x: number
  y: number
  opacity: number
  birth: number
}

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const posRef = useRef({ x: -999, y: -999 })
  const dotsArrayRef = useRef<Dot[]>([])
  const rafRef = useRef<number>(0)
  const lastDotRef = useRef(0)
  const isTouchRef = useRef(false)

  const animate = useCallback(() => {
    const glow = glowRef.current
    const canvas = dotsRef.current
    if (!glow || !canvas) return

    // Lerp toward mouse
    posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.15
    posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.15

    glow.style.transform = `translate(${posRef.current.x - 100}px, ${posRef.current.y - 100}px)`

    // Draw trailing dots
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = Date.now()
      const dots = dotsArrayRef.current

      // Remove expired dots
      while (dots.length > 0 && now - dots[0].birth > 400) {
        dots.shift()
      }

      for (const dot of dots) {
        const age = (now - dot.birth) / 400
        const alpha = (1 - age) * 0.25
        if (alpha <= 0) continue
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(78, 195, 115, ${alpha})`
        ctx.fill()
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Detect touch devices
    if (window.matchMedia('(hover: none)').matches) {
      isTouchRef.current = true
      return
    }

    const canvas = dotsRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY

      // Spawn trail dot (cap at ~20, throttle by distance)
      const now = Date.now()
      if (now - lastDotRef.current > 20 && dotsArrayRef.current.length < 20) {
        dotsArrayRef.current.push({ x: e.clientX, y: e.clientY, opacity: 1, birth: now })
        lastDotRef.current = now
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('resize', onResize)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  if (typeof window !== 'undefined' && window.matchMedia?.('(hover: none)').matches) {
    return null
  }

  return (
    <>
      {/* Radial glow */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
      {/* Trail dots canvas */}
      <canvas
        ref={dotsRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  )
}
