'use client'

import { useRef, useState, useEffect } from 'react'
import { DashedCard } from '@shawnos/shared/components'

function XCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E05555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  )
}

const cards = [
  {
    title: '...Want a $500 Template Site',
    desc: 'We build custom sites designed around your business. Templates exist for a reason - but our clients need more.',
  },
  {
    title: '...Need It Done Tomorrow',
    desc: 'Good sites take 1-4 weeks. Rush jobs make bad sites that cost you customers.',
  },
  {
    title: '...Want to Stay on WordPress',
    desc: 'Our approach is built on faster technology. WordPress is not part of our stack.',
  },
  {
    title: "...Don't Care About Performance",
    desc: 'Speed and rankings are our foundation. If that does not matter to you, we are not the right fit.',
  },
  {
    title: '...Want to Edit It Yourself',
    desc: 'We handle updates through support packages. You focus on your business.',
  },
  {
    title: '...Just Need a Logo',
    desc: 'We build full websites, not brand identities. We can recommend branding partners.',
  },
]

export function NotRightFit() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft
      const cardWidth = el.firstElementChild
        ? (el.firstElementChild as HTMLElement).offsetWidth + 16
        : 300
      setActiveIndex(Math.round(scrollLeft / cardWidth))
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ padding: '0 24px 80px', maxWidth: 1200, margin: '0 auto' }}>
      <div
        ref={scrollRef}
        className="notfit-grid"
      >
        {cards.map((card) => (
          <div
            key={card.title}
            className="notfit-card"
          >
            <DashedCard style={{
              height: '100%',
              borderLeft: '3px solid #E05555',
            }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <XCircleIcon />
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {card.title}
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {card.desc}
              </div>
            </DashedCard>
          </div>
        ))}
      </div>

      {/* Pagination dots - mobile only */}
      <div className="notfit-dots">
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: i === activeIndex ? 'var(--accent)' : 'var(--border-dashed)',
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </div>

      <style>{`
        .notfit-grid {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 16px;
          scrollbar-width: none;
        }
        .notfit-grid::-webkit-scrollbar { display: none; }
        .notfit-card {
          flex: 0 0 280px;
          scroll-snap-align: start;
        }
        .notfit-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }
        @media (min-width: 900px) {
          .notfit-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            overflow-x: visible;
            scroll-snap-type: none;
          }
          .notfit-card {
            flex: unset;
          }
          .notfit-dots {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
