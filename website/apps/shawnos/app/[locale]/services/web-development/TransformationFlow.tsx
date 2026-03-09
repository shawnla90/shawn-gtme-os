'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { DashedCard } from '@shawnos/shared/components'
import type { TransformationStep } from './i18n/types'

/* ── SVG Icons ── */

function ClockIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MagnifyIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function TerminalIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <polyline points="7 8 11 12 7 16" />
      <line x1="13" y1="16" x2="17" y2="16" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function TrendUpIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

const stepIcons = [ClockIcon, MagnifyIcon, TerminalIcon, ShieldCheckIcon, TrendUpIcon]

const stepColors = [
  '#E05555',
  'var(--text-secondary)',
  'var(--accent)',
  'var(--accent)',
  'var(--accent)',
]

interface TransformationFlowProps {
  steps: TransformationStep[]
}

export function TransformationFlow({ steps }: TransformationFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  })

  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div ref={containerRef} style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
      {/* Desktop connecting line */}
      <div
        style={{
          position: 'relative',
          display: 'none',
          marginBottom: 32,
          height: 2,
        }}
        className="flow-line-desktop"
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            borderBottom: '2px dashed var(--border-dashed)',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 2,
            width: lineWidth,
            backgroundColor: 'var(--accent)',
          }}
        />
      </div>

      {/* Cards */}
      <div className="flow-grid">
        {steps.map((step, i) => {
          const IconComponent = stepIcons[i]
          const color = stepColors[i]
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <DashedCard style={{ textAlign: 'center', height: '100%' }}>
                <div style={{ color, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                  <IconComponent />
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color,
                    marginBottom: 4,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {step.detail}
                </div>
              </DashedCard>
            </motion.div>
          )
        })}
      </div>

      <style>{`
        .flow-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .flow-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
          }
          .flow-line-desktop {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}
