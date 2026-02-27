'use client'

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { MotionReveal } from './MotionReveal'

interface HorizontalScrollSectionProps {
  children: ReactNode
  showProgress?: boolean
  style?: CSSProperties
  className?: string
}

export function HorizontalScrollSection({
  children,
  showProgress = true,
  style,
  className,
}: HorizontalScrollSectionProps) {
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelCount = Children.count(children)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${(panelCount - 1) * 100}%`],
  )

  const x = useSpring(rawX, { stiffness: 100, damping: 30 })

  // Active panel index for progress dots
  const [activePanel, setActivePanel] = useState(0)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      const idx = Math.round(v * (panelCount - 1))
      setActivePanel(idx)
    })
    return unsubscribe
  }, [scrollYProgress, panelCount])

  // Mobile: vertical stacked sections with MotionReveal
  if (isMobile) {
    return (
      <div className={className} style={style}>
        {Children.map(children, (child, i) => (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.1}>
            <div style={{ marginBottom: i < panelCount - 1 ? 48 : 0 }}>
              {child}
            </div>
          </MotionReveal>
        ))}
      </div>
    )
  }

  // Desktop: horizontal scroll-jacking
  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: `${panelCount * 100}vh`,
        position: 'relative',
        ...style,
      }}
    >
      {/* Sticky inner */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            x,
            display: 'flex',
            height: '100%',
            willChange: 'transform',
          }}
        >
          {children}
        </motion.div>

        {/* Progress dots */}
        {showProgress && (
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 8,
              zIndex: 10,
            }}
          >
            {Array.from({ length: panelCount }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: activePanel === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    activePanel === i
                      ? 'var(--accent, #9B72CF)'
                      : 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
