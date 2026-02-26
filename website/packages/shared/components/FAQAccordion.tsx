'use client'

import { useState } from 'react'
import { MotionReveal } from './motion'

interface FAQItem {
  question: string
  answer: React.ReactNode
}

interface FAQAccordionProps {
  items: FAQItem[]
  style?: React.CSSProperties
}

export function FAQAccordion({ items, style }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={style}>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <MotionReveal key={i} variant="fadeUp" delay={i * 0.06}>
            <div
              style={{
                borderBottom: '1px solid var(--border)',
                ...(i === 0 ? { borderTop: '1px solid var(--border)' } : {}),
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '20px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: 'var(--accent)',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  $
                </span>
                <span style={{ flex: 1 }}>{item.question}</span>
                <span className={`faq-chevron${isOpen ? ' open' : ''}`}>
                  &gt;
                </span>
              </button>

              <div className={`faq-answer-wrapper${isOpen ? ' open' : ''}`}>
                <div className="faq-answer-inner">
                  <div
                    style={{
                      padding: '0 0 20px 24px',
                      borderLeft: '2px solid var(--accent)',
                      marginLeft: 6,
                      fontSize: '14px',
                      lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          </MotionReveal>
        )
      })}
    </div>
  )
}
