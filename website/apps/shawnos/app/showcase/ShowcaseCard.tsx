'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface ShowcaseCardProps {
  title: string
  description: string
  children: React.ReactNode
  stats?: string[]
}

export function ShowcaseCard({
  title,
  description,
  children,
  stats,
}: ShowcaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.005, borderColor: 'var(--accent)' }}
      style={{
        padding: '24px',
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontFamily: 'var(--font-mono)',
        position: 'relative',
        transition: 'border-color 0.2s ease',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            margin: '0 0 6px 0',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>##</span> {title}
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', marginBottom: '20px' }} />

      <div>{children}</div>

      {stats && stats.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border)',
            justifyContent: 'flex-end',
          }}
        >
          {stats.map((stat) => (
            <span
              key={stat}
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent)',
                background: 'rgba(78, 195, 115, 0.08)',
                border: '1px solid rgba(78, 195, 115, 0.25)',
                borderRadius: '4px',
                letterSpacing: '0.03em',
              }}
            >
              {stat}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
