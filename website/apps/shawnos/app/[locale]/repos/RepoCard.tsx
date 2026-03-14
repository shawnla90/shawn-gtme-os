'use client'

import { motion } from 'framer-motion'
import type { Repo } from '@shawnos/shared/data/repos'

interface RepoCardProps {
  repo: Repo
  featured?: boolean
}

export function RepoCard({ repo, featured = false }: RepoCardProps) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.005, borderColor: 'var(--accent)' }}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        padding: featured ? '32px' : '24px',
        background: 'var(--canvas-subtle)',
        border: featured ? '2px solid var(--accent)' : '1px solid var(--border)',
        borderRadius: '8px',
        fontFamily: 'var(--font-mono)',
        transition: 'border-color 0.2s ease',
        gridColumn: featured ? '1 / -1' : undefined,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h2 style={{
            fontSize: featured ? '18px' : '14px',
            fontWeight: 600,
            color: 'var(--accent)',
            margin: '0 0 6px 0',
          }}>
            {repo.name}
          </h2>
          {repo.author && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              by{' '}
              {repo.authorUrl ? (
                <a
                  href={repo.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {repo.author}
                </a>
              ) : (
                repo.author
              )}
            </span>
          )}
        </div>
        <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>&#8599;</span>
      </div>

      <p style={{
        fontSize: featured ? '14px' : '13px',
        color: 'var(--text-secondary)',
        margin: '0 0 16px 0',
        lineHeight: 1.6,
      }}>
        {repo.description}
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {repo.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(78, 195, 115, 0.1)',
              color: 'var(--accent)',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}
