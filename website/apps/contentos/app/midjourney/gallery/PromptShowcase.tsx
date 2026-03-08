'use client'

import { motion } from 'framer-motion'
import { MJ } from './gallery-data'

export interface ShowcaseItem {
  id: string
  icon: string
  title: string
  prompt: string
  accentColor: string
  imagePath: string
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: 'mage',
    icon: '\uD83E\uDE84',
    title: 'Summon a Patronus',
    prompt:
      'mystical mage in flowing dark robes, raising crystal wand, ethereal phoenix patronus materializing from wand tip, swirling silver-blue energy transforming to golden fire, dark enchanted background, dramatic backlighting --ar 1:1 --v 7',
    accentColor: MJ.mjBlue,
    imagePath: '/midjourney/showcase-mage.gif',
  },
  {
    id: 'phoenix',
    icon: '\uD83D\uDD25',
    title: 'Phoenix Spirit',
    prompt:
      'phoenix spirit creature, fiery wings spread wide, rebirth energy aura, dancing flames, floating embers, heat distortion, aggressive intense presence, neon red core glow, dark background --ar 1:1 --v 7',
    accentColor: MJ.neonRed,
    imagePath: '/midjourney/showcase-phoenix.gif',
  },
  {
    id: 'bot',
    icon: '\u2694\uFE0F',
    title: 'Build a Bot',
    prompt:
      'bot character, chibi style, cute proportions, oversized head, glitch art teal, matter orange, cosmic cream color scheme, victory pose, triumphant stance, backflip into action pose, radial effects, studio lighting, dark background, clean render --ar 1:1 --v 7',
    accentColor: MJ.promptGreen,
    imagePath: '/midjourney/showcase-bot.gif',
  },
  {
    id: 'diva',
    icon: '\uD83C\uDF38',
    title: 'Atlantis Diva',
    prompt:
      'a beautiful Diva posing on the street, the futuristic cityscape of Atlantis in background, cyberpunk elements and hyper futuristic image, white, gold pink and emerald green color, cherry blossoms --ar 1:1 --v 7',
    accentColor: '#E8B4D8',
    imagePath: '/midjourney/showcase-diva.gif',
  },
]

export function PromptShowcase({
  selected,
  onToggle,
}: {
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <>
      <div
        className="showcase-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {showcaseItems.map((item, i) => {
          const isSelected = selected.has(item.id)
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              onClick={() => onToggle(item.id)}
              className="showcase-card"
              style={{
                position: 'relative',
                background: isSelected
                  ? `${item.accentColor}08`
                  : 'transparent',
                border: isSelected
                  ? `2px solid ${item.accentColor}`
                  : '2px solid transparent',
                borderRadius: 16,
                cursor: 'pointer',
                overflow: 'visible',
                transition: 'transform 0.3s, border-color 0.3s, background 0.3s',
                padding: '20px 16px',
              }}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    zIndex: 3,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: item.accentColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#000',
                  }}
                >
                  ✓
                </motion.div>
              )}

              {/* Icon + Title */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: item.accentColor,
                  }}
                >
                  {item.title}
                </span>
              </div>

              {/* Prompt text (the star of the show - no image) */}
              <code
                style={{
                  display: 'block',
                  color: MJ.promptGreen,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  lineHeight: 1.6,
                  wordBreak: 'break-word',
                  opacity: 0.8,
                }}
              >
                <span style={{ color: MJ.textMuted, userSelect: 'none' }}>
                  /imagine{' '}
                </span>
                {item.prompt}
              </code>

              {/* Bottom hint */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 12,
                }}
              >
                <div
                  className="pulse-dot"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isSelected ? item.accentColor : MJ.textMuted,
                    transition: 'background 0.3s',
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: isSelected ? item.accentColor : MJ.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'color 0.3s',
                  }}
                >
                  {isSelected ? 'Selected' : 'Click to select'}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <style>{`
        .showcase-card:hover {
          transform: translateY(-3px) !important;
        }
        .pulse-dot {
          animation: pulse-showcase 2s ease-in-out infinite;
        }
        @keyframes pulse-showcase {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @media (max-width: 900px) {
          .showcase-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 520px) {
          .showcase-grid {
            grid-template-columns: 1fr !important;
            max-width: 360px !important;
          }
        }
      `}</style>
    </>
  )
}
