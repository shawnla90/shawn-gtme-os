'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  MotionReveal,
  ScrollRevealSection,
  TerminalChrome,
  MagneticHover,
} from '@shawnos/shared/components'
import { techniques } from '../data'
import {
  galleryEntries,
  styleOptions,
  aspectRatioOptions,
  versionOptions,
  suggestedCombinations,
  type GalleryEntry,
} from './gallery-data'

/* ── Theme (matches Phase 1) ─────────────────────────── */

const MJ = {
  accent: '#FF69B4',
  mjBlue: '#5B8DEF',
  gridBg: '#0A0E14',
  promptGreen: '#4EC373',
  dark: '#0D1117',
  darkSubtle: '#161B22',
  border: '#30363D',
  text: '#C9D1D9',
  textMuted: '#8B949E',
} as const

/* ── Filter tags from technique data ─────────────────── */

const allTechniques = techniques.map((t) => ({
  id: t.id,
  label: t.title,
}))

const allStyles = [...new Set(galleryEntries.map((e) => e.style))]

/* ── Lightbox ────────────────────────────────────────── */

function Lightbox({
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
                {renderPromptWithParams(entry.prompt)}
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

/* ── Prompt text renderer ────────────────────────────── */

function renderPromptWithParams(text: string) {
  const parts = text.split(/(--\w+\s+\S+)/g)
  return parts.map((part, i) =>
    part.startsWith('--') ? (
      <span key={i} style={{ color: MJ.mjBlue, fontWeight: 600 }}>
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

/* ── Gallery Card ────────────────────────────────────── */

function GalleryCard({
  entry,
  onClick,
}: {
  entry: GalleryEntry
  onClick: () => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="gallery-card"
      style={{
        background: MJ.darkSubtle,
        border: `1px solid ${MJ.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          width: '100%',
          aspectRatio: entry.aspectRatio === '16:9' ? '16/9' : entry.aspectRatio === '9:16' ? '9/16' : entry.aspectRatio === '2:3' ? '2/3' : entry.aspectRatio === '3:4' ? '3/4' : '1/1',
          maxHeight: 280,
          background: `linear-gradient(135deg, ${MJ.gridBg}, ${MJ.darkSubtle})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: MJ.textMuted,
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
        }}
      >
        image coming soon
      </div>

      {/* Card info */}
      <div style={{ padding: '12px 14px' }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {entry.title}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <span
            style={{
              padding: '2px 6px',
              fontSize: 9,
              color: MJ.mjBlue,
              background: 'rgba(91, 141, 239, 0.1)',
              borderRadius: 3,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
            }}
          >
            {entry.style}
          </span>
          <span
            style={{
              padding: '2px 6px',
              fontSize: 9,
              color: MJ.accent,
              background: 'rgba(255, 105, 180, 0.1)',
              borderRadius: 3,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {entry.aspectRatio}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Prompt Builder ──────────────────────────────────── */

function PromptBuilder() {
  const [subject, setSubject] = useState('')
  const [style, setStyle] = useState(styleOptions[0].value)
  const [ar, setAr] = useState('1:1')
  const [version, setVersion] = useState('6.1')
  const [useCref, setUseCref] = useState(false)
  const [useSref, setUseSref] = useState(false)
  const [useOref, setUseOref] = useState(false)
  const [useRaw, setUseRaw] = useState(false)
  const [copied, setCopied] = useState(false)

  const assembledPrompt = useMemo(() => {
    const parts: string[] = []
    if (subject.trim()) {
      parts.push(subject.trim())
    } else {
      parts.push('[your subject here]')
    }
    parts.push(style)

    const params: string[] = []
    params.push(`--ar ${ar}`)
    params.push(`--v ${version}`)
    if (useCref) params.push('--cref [url] --cw 100')
    if (useSref) params.push('--sref [url] --sw 100')
    if (useOref) params.push('--oref [url] --ow 100')
    if (useRaw) params.push('--style raw')

    return `${parts.join(', ')} ${params.join(' ')}`
  }, [subject, style, ar, version, useCref, useSref, useOref, useRaw])

  function handleCopy() {
    navigator.clipboard.writeText(assembledPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function applySuggestion(idx: number) {
    const s = suggestedCombinations[idx]
    setSubject(s.subject)
    setStyle(s.style)
    setAr(s.ar)
    setVersion(s.version)
    setUseCref(s.extras.some((e) => e.includes('--cref')))
    setUseSref(s.extras.some((e) => e.includes('--sref')))
    setUseOref(s.extras.some((e) => e.includes('--oref')))
    setUseRaw(s.extras.some((e) => e.includes('--style raw')))
  }

  const toggleStyle: React.CSSProperties = {
    padding: '6px 14px',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    fontWeight: 600,
  }

  return (
    <div>
      {/* Suggested combinations */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            fontSize: 11,
            color: MJ.textMuted,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 8,
          }}
        >
          Quick Start Templates
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {suggestedCombinations.map((s, i) => (
            <button
              key={s.label}
              onClick={() => applySuggestion(i)}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: MJ.text,
                background: 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${MJ.border}`,
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject input */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: MJ.text,
            fontFamily: 'var(--font-mono)',
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="chibi warrior character, green armor, action pose..."
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 14,
            fontFamily: 'var(--font-mono)',
            color: MJ.text,
            background: MJ.gridBg,
            border: `1px solid ${MJ.border}`,
            borderRadius: 8,
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Style + AR + Version row */}
      <div
        className="builder-controls"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Style */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: MJ.text,
              fontFamily: 'var(--font-mono)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: MJ.text,
              background: MJ.gridBg,
              border: `1px solid ${MJ.border}`,
              borderRadius: 8,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {styleOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: MJ.text,
              fontFamily: 'var(--font-mono)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Aspect Ratio
          </label>
          <select
            value={ar}
            onChange={(e) => setAr(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: MJ.text,
              background: MJ.gridBg,
              border: `1px solid ${MJ.border}`,
              borderRadius: 8,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {aspectRatioOptions.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Version */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: MJ.text,
              fontFamily: 'var(--font-mono)',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Version
          </label>
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              color: MJ.text,
              background: MJ.gridBg,
              border: `1px solid ${MJ.border}`,
              borderRadius: 8,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {versionOptions.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reference toggles */}
      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: MJ.text,
            fontFamily: 'var(--font-mono)',
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          References & Modifiers
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            onClick={() => setUseCref(!useCref)}
            style={{
              ...toggleStyle,
              color: useCref ? MJ.dark : MJ.textMuted,
              background: useCref
                ? MJ.promptGreen
                : 'rgba(255, 255, 255, 0.04)',
            }}
          >
            --cref
          </button>
          <button
            onClick={() => setUseSref(!useSref)}
            style={{
              ...toggleStyle,
              color: useSref ? MJ.dark : MJ.textMuted,
              background: useSref
                ? MJ.mjBlue
                : 'rgba(255, 255, 255, 0.04)',
            }}
          >
            --sref
          </button>
          <button
            onClick={() => setUseOref(!useOref)}
            style={{
              ...toggleStyle,
              color: useOref ? MJ.dark : MJ.textMuted,
              background: useOref
                ? MJ.accent
                : 'rgba(255, 255, 255, 0.04)',
            }}
          >
            --oref
          </button>
          <button
            onClick={() => setUseRaw(!useRaw)}
            style={{
              ...toggleStyle,
              color: useRaw ? MJ.dark : MJ.textMuted,
              background: useRaw
                ? MJ.text
                : 'rgba(255, 255, 255, 0.04)',
            }}
          >
            --style raw
          </button>
        </div>
      </div>

      {/* Live preview */}
      <TerminalChrome title="prompt preview">
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
              fontSize: 14,
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              paddingRight: 60,
            }}
          >
            <span style={{ color: MJ.textMuted, userSelect: 'none' }}>
              /imagine{' '}
            </span>
            {renderPromptWithParams(assembledPrompt)}
          </code>
        </div>
      </TerminalChrome>
    </div>
  )
}

/* ── Main Export ──────────────────────────────────────── */

export function GalleryContent() {
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null)
  const [activeStyle, setActiveStyle] = useState<string | null>(null)
  const [lightboxEntry, setLightboxEntry] = useState<GalleryEntry | null>(null)

  const filtered = useMemo(() => {
    return galleryEntries.filter((entry) => {
      if (activeTechnique && !entry.techniques.includes(activeTechnique))
        return false
      if (activeStyle && entry.style !== activeStyle) return false
      return true
    })
  }, [activeTechnique, activeStyle])

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="full-bleed"
        style={{
          background: `radial-gradient(ellipse 800px 500px at 50% 40%, rgba(91, 141, 239, 0.08), transparent 60%), ${MJ.dark}`,
          padding: '120px 24px 60px',
          textAlign: 'center',
        }}
      >
        <MotionReveal variant="fadeUp">
          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 600,
              color: MJ.mjBlue,
              background: 'rgba(91, 141, 239, 0.08)',
              border: '1px solid rgba(91, 141, 239, 0.2)',
              borderRadius: 999,
              marginBottom: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Gallery & Tools
          </div>
        </MotionReveal>

        <MotionReveal variant="fadeUp" delay={0.1}>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.15,
            }}
          >
            MidJourney Gallery
          </h1>
          <p
            style={{
              fontSize: 17,
              color: MJ.textMuted,
              maxWidth: 560,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Browse art with full prompts. Click any piece to see the exact
            prompt, parameters, and techniques used. Build your own below.
          </p>
        </MotionReveal>
      </section>

      {/* ── Filter Bar ── */}
      <section className="full-bleed" style={{ background: MJ.darkSubtle }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '20px 24px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {/* All filter */}
            <button
              onClick={() => {
                setActiveTechnique(null)
                setActiveStyle(null)
              }}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color:
                  !activeTechnique && !activeStyle ? MJ.dark : MJ.textMuted,
                background:
                  !activeTechnique && !activeStyle
                    ? MJ.accent
                    : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${!activeTechnique && !activeStyle ? MJ.accent : MJ.border}`,
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              All
            </button>

            {/* Technique filters */}
            {allTechniques.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTechnique(activeTechnique === t.id ? null : t.id)
                  setActiveStyle(null)
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: activeTechnique === t.id ? MJ.dark : MJ.textMuted,
                  background:
                    activeTechnique === t.id
                      ? MJ.promptGreen
                      : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${activeTechnique === t.id ? MJ.promptGreen : MJ.border}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}

            {/* Divider */}
            <div
              style={{
                width: 1,
                height: 28,
                background: MJ.border,
                alignSelf: 'center',
              }}
            />

            {/* Style filters */}
            {allStyles.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setActiveStyle(activeStyle === s ? null : s)
                  setActiveTechnique(null)
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: activeStyle === s ? MJ.dark : MJ.textMuted,
                  background:
                    activeStyle === s
                      ? MJ.mjBlue
                      : 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${activeStyle === s ? MJ.mjBlue : MJ.border}`,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div
            style={{
              marginTop: 12,
              fontSize: 12,
              color: MJ.textMuted,
              fontFamily: 'var(--font-mono)',
            }}
          >
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
          </div>
        </div>
      </section>

      {/* ── Gallery Grid ── */}
      <section className="full-bleed" style={{ background: MJ.dark }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '40px 24px 80px',
          }}
        >
          <motion.div
            layout
            className="gallery-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((entry) => (
                <GalleryCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => setLightboxEntry(entry)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                color: MJ.textMuted,
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
              }}
            >
              No pieces match the current filter. Try a different combination.
            </div>
          )}
        </div>
      </section>

      {/* ── Prompt Builder ── */}
      <section className="full-bleed" style={{ background: MJ.gridBg }}>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '80px 24px',
          }}
        >
          <MotionReveal variant="fadeUp">
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: MJ.accent,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-mono)',
                marginBottom: 8,
              }}
            >
              Interactive Tool
            </div>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 8px',
              }}
            >
              Prompt Builder
            </h2>
            <p
              style={{
                fontSize: 15,
                color: MJ.textMuted,
                margin: '0 0 32px',
                lineHeight: 1.6,
              }}
            >
              Assemble a MidJourney prompt with the interactive controls below.
              Toggle parameters, pick a style, and copy the result.
            </p>
          </MotionReveal>

          <MotionReveal variant="fadeUp" delay={0.1}>
            <PromptBuilder />
          </MotionReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="full-bleed" style={{ background: MJ.darkSubtle }}>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <MotionReveal variant="scale">
            <h2
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 16px',
              }}
            >
              Learn the techniques
            </h2>
            <p
              style={{
                fontSize: 16,
                color: MJ.textMuted,
                margin: '0 0 32px',
                lineHeight: 1.6,
              }}
            >
              Dive deeper into CREF, OREF, style consistency, and prompt
              engineering fundamentals.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <MagneticHover>
                <Link
                  href="/midjourney"
                  style={{
                    display: 'inline-block',
                    padding: '14px 28px',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: MJ.dark,
                    background: MJ.accent,
                    borderRadius: 8,
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  MidJourney Mastery
                </Link>
              </MagneticHover>
              <MagneticHover>
                <Link
                  href="/content-wiki"
                  style={{
                    display: 'inline-block',
                    padding: '14px 28px',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: MJ.text,
                    background: 'transparent',
                    border: `1px solid ${MJ.border}`,
                    borderRadius: 8,
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  Content Wiki
                </Link>
              </MagneticHover>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxEntry && (
          <Lightbox
            entry={lightboxEntry}
            onClose={() => setLightboxEntry(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Scoped styles ── */}
      <style>{`
        .gallery-card:hover {
          border-color: ${MJ.accent} !important;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .builder-controls {
            grid-template-columns: 1fr !important;
          }
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
          }
        }
      `}</style>
    </>
  )
}
