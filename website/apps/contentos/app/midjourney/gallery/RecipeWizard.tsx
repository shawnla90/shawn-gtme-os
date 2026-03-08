'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MJ, recipes, type RecipeId } from './gallery-data'
import { assemblePrompt } from './utils'

interface WizardProps {
  recipeId: RecipeId
  onComplete: (prompt: string, accentColor: string) => void
  onBack: () => void
}

export function RecipeWizard({ recipeId, onComplete, onBack }: WizardProps) {
  const recipe = recipes.find((r) => r.id === recipeId)!
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState<Record<string, string>>({})
  const [direction, setDirection] = useState(1)

  const step = recipe.steps[currentStep]
  const totalSteps = recipe.steps.length
  const isLastStep = currentStep === totalSteps - 1
  const allSelected = recipe.steps.every((s) => selections[s.id])

  const handleSelect = useCallback(
    (value: string) => {
      setSelections((prev) => ({ ...prev, [step.id]: value }))
    },
    [step.id],
  )

  function handleNext() {
    if (isLastStep && allSelected) {
      const prompt = assemblePrompt(recipe, selections)
      onComplete(prompt, recipe.accentColor)
    } else if (selections[step.id]) {
      setDirection(1)
      setCurrentStep((s) => s + 1)
    }
  }

  function handlePrev() {
    if (currentStep === 0) {
      onBack()
    } else {
      setDirection(-1)
      setCurrentStep((s) => s - 1)
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        maxWidth: 680,
        margin: '0 auto',
        background: MJ.darkSubtle,
        border: `1px solid ${MJ.border}`,
        borderRadius: 16,
        padding: '32px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${recipe.accentColor}, transparent)`,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: recipe.accentColor,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 4,
            }}
          >
            {recipe.icon} {recipe.title}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-primary)',
            }}
          >
            Choose {step.label}
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6 }}>
          {recipe.steps.map((s, i) => (
            <div
              key={s.id}
              style={{
                width: i === currentStep ? 32 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  i < currentStep
                    ? recipe.accentColor
                    : i === currentStep
                      ? recipe.accentColor
                      : `${MJ.border}`,
                opacity: i <= currentStep ? 1 : 0.4,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Options grid */}
      <div style={{ minHeight: 200, position: 'relative' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="wizard-options-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}
          >
            {step.options.map((option) => {
              const isSelected = selections[step.id] === option.value
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  whileTap={{ scale: 0.97 }}
                  className="wizard-option"
                  style={{
                    background: isSelected
                      ? `${recipe.accentColor}12`
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? recipe.accentColor : MJ.border}`,
                    borderRadius: 12,
                    padding: '16px 14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Selection checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: recipe.accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        color: MJ.dark,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </motion.div>
                  )}

                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)',
                      color: isSelected
                        ? recipe.accentColor
                        : 'var(--text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    {option.label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: MJ.textMuted,
                      lineHeight: 1.4,
                    }}
                  >
                    {option.description}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 24,
        }}
      >
        <button
          onClick={handlePrev}
          style={{
            padding: '10px 20px',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: MJ.textMuted,
            background: 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${MJ.border}`,
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {currentStep === 0 ? 'Back to recipes' : 'Previous'}
        </button>

        <button
          onClick={handleNext}
          disabled={!selections[step.id]}
          className={isLastStep && allSelected ? 'generate-btn' : ''}
          style={{
            padding: '10px 24px',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: selections[step.id] ? MJ.dark : MJ.textMuted,
            background: selections[step.id]
              ? recipe.accentColor
              : 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            borderRadius: 8,
            cursor: selections[step.id] ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: selections[step.id] ? 1 : 0.5,
          }}
        >
          {isLastStep ? 'Generate Prompt' : 'Next'}
        </button>
      </div>

      <style>{`
        .wizard-option:hover {
          border-color: ${recipe.accentColor}60 !important;
          background: ${recipe.accentColor}08 !important;
        }
        .generate-btn {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 ${recipe.accentColor}40; }
          50% { box-shadow: 0 0 20px 4px ${recipe.accentColor}30; }
        }
        @media (max-width: 768px) {
          .wizard-options-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
