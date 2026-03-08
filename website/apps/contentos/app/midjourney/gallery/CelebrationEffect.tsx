'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  decay: number
}

export function CelebrationEffect({
  accentColor,
  onComplete,
}: {
  accentColor: string
  onComplete: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = [accentColor, '#FFFFFF', accentColor + 'CC', '#FFD700']
    const particles: Particle[] = []

    // Spawn particles from center
    const cx = canvas.width / 2
    const cy = canvas.height / 2

    for (let i = 0; i < 45; i++) {
      const angle = (Math.PI * 2 * i) / 45 + (Math.random() - 0.5) * 0.5
      const speed = 4 + Math.random() * 8
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.008,
      })
    }

    let animId: number
    const startTime = Date.now()

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      let alive = false
      for (const p of particles) {
        if (p.alpha <= 0) continue
        alive = true

        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15 // gravity
        p.vx *= 0.99
        p.alpha -= p.decay

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle =
          p.color +
          Math.floor(Math.max(0, p.alpha) * 255)
            .toString(16)
            .padStart(2, '0')
        ctx.fill()
      }

      if (alive && Date.now() - startTime < 2000) {
        animId = requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }

    animId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animId)
  }, [accentColor, onComplete])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    />
  )
}
