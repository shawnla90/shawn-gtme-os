'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MJ } from './gallery-data'
import type { ShowcaseItem } from './PromptShowcase'

/* ── Pure black background - must match GIF darkness ──── */

const CANVAS_BG = '#000000'

/* ── Ambient particle config per character ──────────────── */

const CHAR_PARTICLES: Record<string, string[]> = {
  mage: ['#A0C4FF', '#7EB8FF', '#5B8DEF', '#E0E8FF'],
  phoenix: ['#FF073A', '#FF4500', '#FFD700', '#FFA500'],
  bot: ['#00CED1', '#4EC373', '#FF6B2B', '#FFA500'],
  diva: ['#FFB7D5', '#FF69B4', '#E8B4D8', '#FFD700'],
}

interface AmbientParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  life: number
}

/* ── Main Overlay Component ───────────────────────────── */

export function SceneOverlay({
  items,
  onClose,
}: {
  items: ShowcaseItem[]
  onClose: () => void
}) {
  const ambientCanvasRef = useRef<HTMLCanvasElement>(null)
  const charRefs = useRef<Record<string, HTMLImageElement | null>>({})
  const mouseRef = useRef({ x: 0, y: 0 })
  const physicsRef = useRef<
    Record<string, { x: number; y: number; vx: number; vy: number }>
  >({})

  // Character physics loop
  useEffect(() => {
    const w = window.innerWidth
    const h = window.innerHeight

    // Init physics for each character - spread them out
    items.forEach((item, i) => {
      const angle = (Math.PI * 2 * i) / Math.max(items.length, 1)
      const spread = Math.min(w, h) * 0.15
      const size = charSize(items.length)
      physicsRef.current[item.id] = {
        x: w / 2 - size / 2 + Math.cos(angle) * spread,
        y: h / 2 - size / 2 + Math.sin(angle) * spread,
        vx: (2 + Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1),
        vy: (2 + Math.random() * 3) * (Math.random() > 0.5 ? 1 : -1),
      }
    })

    let animId: number

    function tick() {
      const now = performance.now() / 1000
      const m = mouseRef.current
      const size = charSize(items.length)

      items.forEach((item) => {
        const p = physicsRef.current[item.id]
        if (!p) return
        const centerX = p.x + size / 2
        const centerY = p.y + size / 2

        // Organic drift force
        p.vx += Math.cos(now * 1.2 + centerY * 0.003) * 0.08
        p.vy += Math.sin(now * 1.2 + centerX * 0.003) * 0.08

        // Mouse attraction - stronger pull
        const dx = m.x - centerX
        const dy = m.y - centerY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 500 && dist > 30) {
          p.vx += (dx / dist) * 0.4
          p.vy += (dy / dist) * 0.4
        }

        // Light damping for faster movement
        p.vx *= 0.985
        p.vy *= 0.985

        // Higher speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 10) {
          p.vx = (p.vx / speed) * 10
          p.vy = (p.vy / speed) * 10
        }

        // Move
        p.x += p.vx
        p.y += p.vy

        // Bounce off walls - keep partially visible
        const margin = size * 0.15
        if (p.x < -margin) {
          p.x = -margin
          p.vx *= -0.7
        }
        if (p.x > w - size + margin) {
          p.x = w - size + margin
          p.vx *= -0.7
        }
        if (p.y < -margin) {
          p.y = -margin
          p.vy *= -0.7
        }
        if (p.y > h - size + margin) {
          p.y = h - size + margin
          p.vy *= -0.7
        }

        // Character-character repulsion (prevent overlap)
        items.forEach((other) => {
          if (other.id === item.id) return
          const op = physicsRef.current[other.id]
          if (!op) return
          const ocx = op.x + size / 2
          const ocy = op.y + size / 2
          const rdx = centerX - ocx
          const rdy = centerY - ocy
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy)
          if (rdist < size * 0.9 && rdist > 0) {
            const force = (size * 0.9 - rdist) * 0.02
            p.vx += (rdx / rdist) * force
            p.vy += (rdy / rdist) * force
          }
        })

        // Apply to DOM
        const el = charRefs.current[item.id]
        if (el) {
          const rot = p.vx * 1.5
          el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${rot}deg)`
        }
      })

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [items])

  // Ambient particle canvas
  useEffect(() => {
    const canvas = ambientCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = window.innerWidth
    const h = window.innerHeight
    canvas.width = w
    canvas.height = h

    // Collect all particle colors from selected items
    const colors: string[] = []
    items.forEach((item) => {
      const cs = CHAR_PARTICLES[item.id] || ['#FFFFFF']
      colors.push(...cs)
    })

    const ps: AmbientParticle[] = []
    let animId: number

    function frame() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      // Emit
      if (ps.length < 50 + items.length * 15) {
        const edge = Math.random()
        let px: number, py: number, pvx: number, pvy: number
        if (edge < 0.25) {
          px = Math.random() * w; py = -5; pvx = (Math.random() - 0.5) * 0.6; pvy = 0.3 + Math.random() * 1
        } else if (edge < 0.5) {
          px = Math.random() * w; py = h + 5; pvx = (Math.random() - 0.5) * 0.6; pvy = -(0.3 + Math.random() * 1)
        } else if (edge < 0.75) {
          px = -5; py = Math.random() * h; pvx = 0.3 + Math.random(); pvy = (Math.random() - 0.5) * 0.6
        } else {
          px = w + 5; py = Math.random() * h; pvx = -(0.3 + Math.random()); pvy = (Math.random() - 0.5) * 0.6
        }
        ps.push({
          x: px, y: py, vx: pvx, vy: pvy,
          radius: 1 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.4 + Math.random() * 0.3,
          life: 1,
        })
      }

      const now = performance.now() / 1000
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        p.x += p.vx
        p.y += p.vy
        p.vx += Math.sin(now + p.x * 0.005) * 0.005
        p.life -= 0.003
        p.alpha = Math.max(0, p.life * 0.5)
        if (p.life <= 0 || p.y > h + 10 || p.y < -10 || p.x < -10 || p.x > w + 10) {
          ps.splice(i, 1)
          continue
        }
        // Glow
        ctx.globalAlpha = p.alpha * 0.08
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      animId = requestAnimationFrame(frame)
    }
    animId = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animId)
  }, [items])

  // Mouse tracking
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // ESC to close
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )
  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const size = charSize(items.length)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        background: CANVAS_BG,
        cursor: 'default',
      }}
    >
      {/* Ambient particle canvas */}
      <canvas
        ref={ambientCanvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Floating character images */}
      {items.map((item, i) => (
        <motion.img
          key={item.id}
          ref={(el) => {
            charRefs.current[item.id] = el
          }}
          src={item.imagePath}
          alt={item.title}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: i * 0.15,
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            objectFit: 'cover',
            borderRadius: '50%',
            pointerEvents: 'none',
            willChange: 'transform',
            /* Critical: radial mask fades edges to black so GIF blends
               with the pure black canvas - no box visible */
            maskImage:
              'radial-gradient(ellipse 80% 80% at 50% 50%, black 35%, transparent 72%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 50% 50%, black 35%, transparent 72%)',
          }}
        />
      ))}

      {/* Prompt text at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '0 40px',
        }}
      >
        {items.map((item, i) => (
          <div key={item.id} style={{ marginBottom: i < items.length - 1 ? 6 : 0 }}>
            <code
              style={{
                color: item.accentColor,
                fontFamily: 'monospace',
                fontSize: 11,
                lineHeight: 1.5,
                wordBreak: 'break-word',
                opacity: 0.7,
              }}
            >
              <span style={{ color: MJ.textMuted }}>{item.icon} </span>
              {item.title}
            </code>
          </div>
        ))}
      </motion.div>

      {/* Close button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          zIndex: 10,
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${MJ.border}`,
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          color: MJ.textMuted,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
      >
        ESC to close
      </motion.button>
    </motion.div>
  )
}

/* ── Helper: character size based on count ────────────── */

function charSize(count: number): number {
  if (count <= 1) return 360
  if (count === 2) return 300
  if (count === 3) return 260
  return 220
}
