'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { techniques } from '../data'
import { MJ, galleryEntries, type GalleryEntry, type RecipeId } from './gallery-data'

const allTechniques = techniques.map((t) => ({
  id: t.id,
  label: t.title,
}))

const allStyles = [...new Set(galleryEntries.map((e) => e.style))]

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
          aspectRatio:
            entry.aspectRatio === '16:9'
              ? '16/9'
              : entry.aspectRatio === '9:16'
                ? '9/16'
                : entry.aspectRatio === '2:3'
                  ? '2/3'
                  : entry.aspectRatio === '3:4'
                    ? '3/4'
                    : '1/1',
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

/* ── Gallery Grid with Filters ───────────────────────── */

export function GalleryGrid({
  filterRecipe,
  onSelect,
}: {
  filterRecipe?: RecipeId | null
  onSelect: (entry: GalleryEntry) => void
}) {
  const [activeTechnique, setActiveTechnique] = useState<string | null>(null)
  const [activeStyle, setActiveStyle] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return galleryEntries.filter((entry) => {
      if (filterRecipe && entry.recipeCategory !== filterRecipe) return false
      if (activeTechnique && !entry.techniques.includes(activeTechnique))
        return false
      if (activeStyle && entry.style !== activeStyle) return false
      return true
    })
  }, [filterRecipe, activeTechnique, activeStyle])

  return (
    <>
      {/* Filter Bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
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

          <div
            style={{
              width: 1,
              height: 28,
              background: MJ.border,
              alignSelf: 'center',
            }}
          />

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

      {/* Grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 80px',
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
                onClick={() => onSelect(entry)}
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
    </>
  )
}
