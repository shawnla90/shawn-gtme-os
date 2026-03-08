'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TerminalChrome } from '@shawnos/shared/components'
import { techniques } from '../data'
import { MJ, type GalleryEntry } from './gallery-data'
import { splitPromptParts } from './utils'

export function Lightbox({
  entry,
  onClose,
}: {
  entry: GalleryEntry
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(entry.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        cursor: 'pointer',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 720,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          background: MJ.dark,
          border: `1px solid ${MJ.border}`,
          borderRadius: 16,
          cursor: 'default',
        }}
      >
        {/* Image */}
        <div
          style={{
            width: '100%',
            aspectRatio: entry.aspectRatio.replace(':', '/'),
            maxHeight: 400,
            background: `linear-gradient(135deg, ${MJ.gridBg}, ${MJ.darkSubtle})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: MJ.textMuted,
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden',
          }}
        >
          image coming soon
        </div>

        {/* Details */}
        <div style={{ padding: 24 }}>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              margin: '0 0 8px',
            }}
          >
            {entry.title}
          </h3>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                padding: '3px 8px',
                fontSize: 10,
                fontWeight: 600,
                color: MJ.mjBlue,
                background: 'rgba(91, 141, 239, 0.1)',
                border: '1px solid rgba(91, 141, 239, 0.2)',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
              }}
            >
              {entry.style}
            </span>
            <span
              style={{
                padding: '3px 8px',
                fontSize: 10,
                fontWeight: 600,
                color: MJ.accent,
                background: 'rgba(255, 105, 180, 0.1)',
                border: '1px solid rgba(255, 105, 180, 0.2)',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {entry.aspectRatio}
            </span>
          </div>

          {/* Prompt in terminal */}
          <TerminalChrome title="prompt">
            <div style={{ position: 'relative' }}>
              <button
                onClick={handleCopy}
                style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: copied
                    ? 'rgba(78, 195, 115, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${copied ? MJ.promptGreen : MJ.border}`,
                  borderRadius: 6,
                  padding: '4px 12px',
                  fontSize: 11,
                  color: copied ? MJ.promptGreen : MJ.textMuted,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? 'copied' : 'copy'}
              </button>
              <code
                style={{
                  display: 'block',
                  color: MJ.promptGreen,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  paddingRight: 60,
                }}
              >
                <span style={{ color: MJ.textMuted, userSelect: 'none' }}>
                  /imagine{' '}
                </span>
                {splitPromptParts(entry.prompt).map((part, i) =>
                  part.isParam ? (
                    <span
                      key={i}
                      style={{ color: MJ.mjBlue, fontWeight: 600 }}
                    >
                      {part.text}
                    </span>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </code>
            </div>
          </TerminalChrome>

          {/* Parameters */}
          {entry.parameters.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                marginTop: 12,
              }}
            >
              {entry.parameters.map((p) => (
                <span
                  key={p.key}
                  style={{
                    padding: '3px 10px',
                    fontSize: 11,
                    color: MJ.mjBlue,
                    fontWeight: 600,
                    background: 'rgba(91, 141, 239, 0.08)',
                    border: '1px solid rgba(91, 141, 239, 0.2)',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {p.key} {p.value}
                </span>
              ))}
            </div>
          )}

          {/* Technique links */}
          <div style={{ marginTop: 16 }}>
            <span
              style={{
                fontSize: 11,
                color: MJ.textMuted,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Techniques used:
            </span>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginTop: 6,
              }}
            >
              {entry.techniques.map((techId) => {
                const tech = techniques.find((t) => t.id === techId)
                return tech ? (
                  <Link
                    key={techId}
                    href={`/midjourney#${techId}`}
                    style={{
                      padding: '3px 8px',
                      fontSize: 10,
                      color: MJ.promptGreen,
                      background: 'rgba(78, 195, 115, 0.08)',
                      border: '1px solid rgba(78, 195, 115, 0.2)',
                      borderRadius: 4,
                      fontFamily: 'var(--font-mono)',
                      textDecoration: 'none',
                      transition: 'background 0.2s',
                    }}
                  >
                    {tech.title}
                  </Link>
                ) : null
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
