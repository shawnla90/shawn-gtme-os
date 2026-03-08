'use client'

import { motion } from 'framer-motion'
import { MJ, recipes, type RecipeId } from './gallery-data'

export function RecipeCards({
  onSelect,
}: {
  onSelect: (id: RecipeId) => void
}) {
  return (
    <>
      <div
        className="recipe-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {recipes.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            onClick={() => onSelect(recipe.id)}
            className={`recipe-card recipe-card-${recipe.id}`}
            style={{
              position: 'relative',
              background: `linear-gradient(135deg, ${MJ.darkSubtle}, ${MJ.dark})`,
              border: `1px solid ${MJ.border}`,
              borderRadius: 16,
              padding: '32px 24px',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
            }}
          >
            {/* Accent gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(ellipse 300px 200px at 50% 120%, ${recipe.accentColor}15, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Corner glow */}
            <div
              style={{
                position: 'absolute',
                top: -1,
                left: -1,
                right: -1,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${recipe.accentColor}40, transparent)`,
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon */}
              <div
                style={{
                  fontSize: 36,
                  marginBottom: 16,
                  filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))',
                }}
              >
                {recipe.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  margin: '0 0 4px',
                }}
              >
                {recipe.title}
              </h3>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: 13,
                  color: recipe.accentColor,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {recipe.subtitle}
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 13,
                  color: MJ.textMuted,
                  lineHeight: 1.6,
                  margin: '0 0 16px',
                }}
              >
                {recipe.description}
              </p>

              {/* Step pills */}
              <div style={{ display: 'flex', gap: 6 }}>
                {recipe.steps.map((step) => (
                  <span
                    key={step.id}
                    style={{
                      padding: '3px 10px',
                      fontSize: 10,
                      fontWeight: 600,
                      color: recipe.accentColor,
                      background: `${recipe.accentColor}12`,
                      border: `1px solid ${recipe.accentColor}25`,
                      borderRadius: 999,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .recipe-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        }
        .recipe-card-build-a-bot:hover {
          border-color: ${MJ.promptGreen}60 !important;
        }
        .recipe-card-create-a-spirit:hover {
          border-color: ${MJ.neonRed}60 !important;
        }
        .recipe-card-design-a-scene:hover {
          border-color: ${MJ.mjBlue}60 !important;
        }
        @media (max-width: 768px) {
          .recipe-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
