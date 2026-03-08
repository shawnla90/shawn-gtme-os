'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { MotionReveal, ScrollRevealSection } from '@shawnos/shared/components'
import { MJ, type RecipeId, type GalleryEntry } from './gallery-data'
import { PromptShowcase, showcaseItems, type ShowcaseItem } from './PromptShowcase'
import { SceneOverlay } from './SceneOverlay'
import { RecipeCards } from './RecipeCards'
import { RecipeWizard } from './RecipeWizard'
import { PromptResult } from './PromptResult'
import { CelebrationEffect } from './CelebrationEffect'
import { GalleryGrid } from './GalleryGrid'
import { Lightbox } from './Lightbox'

/* ── Gallery Page Orchestrator ────────────────────────── */

export function GalleryContent() {
  // Recipe wizard state
  const [activeRecipe, setActiveRecipe] = useState<RecipeId | null>(null)
  const [wizardPrompt, setWizardPrompt] = useState<string | null>(null)
  const [wizardAccent, setWizardAccent] = useState<string>(MJ.promptGreen)
  const [showCelebration, setShowCelebration] = useState(false)

  // Showcase multi-select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showScene, setShowScene] = useState(false)

  // Lightbox state
  const [lightboxEntry, setLightboxEntry] = useState<GalleryEntry | null>(null)

  // Selected showcase items for the overlay
  const selectedItems = useMemo(
    () => showcaseItems.filter((item) => selectedIds.has(item.id)),
    [selectedIds],
  )

  // Toggle showcase card selection
  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Recipe wizard handlers
  function handleRecipeSelect(id: RecipeId) {
    setActiveRecipe(id)
    setWizardPrompt(null)
  }

  function handleWizardComplete(prompt: string, accentColor: string) {
    setWizardPrompt(prompt)
    setWizardAccent(accentColor)
    setShowCelebration(true)
  }

  function handleRemix() {
    setWizardPrompt(null)
  }

  function handleBackToRecipes() {
    setActiveRecipe(null)
    setWizardPrompt(null)
  }

  return (
    <>
      {/* ── Hero ────────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px 40px',
          textAlign: 'center',
          background: `radial-gradient(ellipse 600px 400px at 50% 30%, rgba(91,141,239,0.06), transparent)`,
        }}
      >
        <MotionReveal>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 14px',
              background: 'rgba(91,141,239,0.08)',
              border: '1px solid rgba(91,141,239,0.2)',
              borderRadius: 999,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: MJ.mjBlue,
              fontWeight: 600,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            3 Recipes + Interactive Showcase
          </div>
        </MotionReveal>

        <MotionReveal delay={0.1}>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary)',
              margin: '0 0 12px',
              lineHeight: 1.1,
            }}
          >
            MidJourney Recipe Studio
          </h1>
        </MotionReveal>

        <MotionReveal delay={0.2}>
          <p
            style={{
              fontSize: 16,
              color: MJ.textMuted,
              maxWidth: 540,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Select prompts below, then view your creations as interactive
            floating characters on a live canvas.
          </p>
        </MotionReveal>
      </section>

      {/* ── Prompt Showcase (multi-select cards) ─────── */}
      <ScrollRevealSection>
        <section style={{ padding: '0 24px 20px' }}>
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto 24px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 4px',
              }}
            >
              Interactive Showcase
            </h2>
            <p
              style={{
                fontSize: 13,
                color: MJ.textMuted,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Select one or more prompts, then open the canvas to interact with them
            </p>
          </div>
          <PromptShowcase selected={selectedIds} onToggle={handleToggle} />

          {/* View Creations button */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3 }}
                style={{
                  textAlign: 'center',
                  marginTop: 28,
                }}
              >
                <button
                  onClick={() => setShowScene(true)}
                  className="view-creations-btn"
                  style={{
                    padding: '14px 36px',
                    fontSize: 14,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#000',
                    background: `linear-gradient(135deg, ${MJ.mjBlue}, ${MJ.promptGreen})`,
                    border: 'none',
                    borderRadius: 12,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  View {selectedIds.size} Creation{selectedIds.size > 1 ? 's' : ''}
                </button>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: 11,
                    color: MJ.textMuted,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {selectedItems.map((item) => item.icon).join(' ')} selected
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </ScrollRevealSection>

      {/* ── Recipe Cards ─────────────────────────────── */}
      <ScrollRevealSection>
        <section style={{ padding: '40px 24px 40px' }}>
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto 24px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 4px',
              }}
            >
              Prompt Recipes
            </h2>
            <p
              style={{
                fontSize: 13,
                color: MJ.textMuted,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Pick a recipe, choose your options, generate a MidJourney prompt
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!activeRecipe && !wizardPrompt && (
              <motion.div
                key="recipe-cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RecipeCards onSelect={handleRecipeSelect} />
              </motion.div>
            )}

            {activeRecipe && !wizardPrompt && (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <RecipeWizard
                  recipeId={activeRecipe}
                  onComplete={handleWizardComplete}
                  onBack={handleBackToRecipes}
                />
              </motion.div>
            )}

            {wizardPrompt && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <PromptResult
                  prompt={wizardPrompt}
                  accentColor={wizardAccent}
                  onRemix={handleRemix}
                />
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button
                    onClick={handleBackToRecipes}
                    style={{
                      padding: '8px 20px',
                      fontSize: 12,
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: MJ.textMuted,
                      background: 'transparent',
                      border: `1px solid ${MJ.border}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    Back to recipes
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </ScrollRevealSection>

      {/* ── Gallery Grid ─────────────────────────────── */}
      <ScrollRevealSection>
        <section style={{ padding: '20px 0 0' }}>
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
              padding: '0 24px 16px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                margin: '0 0 4px',
              }}
            >
              Community Gallery
            </h2>
            <p
              style={{
                fontSize: 13,
                color: MJ.textMuted,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Browse example outputs and learn the techniques behind each piece
            </p>
          </div>
          <GalleryGrid
            filterRecipe={activeRecipe}
            onSelect={setLightboxEntry}
          />
        </section>
      </ScrollRevealSection>

      {/* ── CTA ──────────────────────────────────────── */}
      <section
        style={{
          padding: '40px 24px 80px',
          textAlign: 'center',
        }}
      >
        <MotionReveal>
          <p
            style={{
              fontSize: 14,
              color: MJ.textMuted,
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}
          >
            Want to learn the techniques behind these prompts?
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/midjourney"
              style={{
                padding: '10px 24px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: MJ.dark,
                background: MJ.mjBlue,
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              MidJourney Mastery
            </Link>
            <Link
              href="/content-wiki"
              style={{
                padding: '10px 24px',
                fontSize: 13,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: MJ.textMuted,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${MJ.border}`,
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              Content Wiki
            </Link>
          </div>
        </MotionReveal>
      </section>

      {/* ── Overlays ─────────────────────────────────── */}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxEntry && (
          <Lightbox
            entry={lightboxEntry}
            onClose={() => setLightboxEntry(null)}
          />
        )}
      </AnimatePresence>

      {/* Scene overlay - multi-character canvas */}
      <AnimatePresence>
        {showScene && selectedItems.length > 0 && (
          <SceneOverlay
            items={selectedItems}
            onClose={() => setShowScene(false)}
          />
        )}
      </AnimatePresence>

      {/* Celebration particles */}
      {showCelebration && (
        <CelebrationEffect
          accentColor={wizardAccent}
          onComplete={() => setShowCelebration(false)}
        />
      )}

      <style>{`
        .view-creations-btn {
          animation: btn-glow 2s ease-in-out infinite;
        }
        @keyframes btn-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(91,141,239,0.3); }
          50% { box-shadow: 0 0 24px 6px rgba(91,141,239,0.2); }
        }
      `}</style>
    </>
  )
}
