'use client'

import { useState } from 'react'

const stepsData = [
  {
    title: 'Free Site Audit',
    summary: 'We check how your site is actually performing.',
    detail: 'We run your current website through Google PageSpeed Insights, check your Core Web Vitals scores, and review your Google search presence. You get a clear report showing exactly where your site stands - load speed, mobile experience, SEO gaps, and what it is costing you in lost customers.',
    timeline: '~24 hours',
  },
  {
    title: 'Strategy Call',
    summary: 'We figure out what your website needs to do.',
    detail: 'A 30-minute conversation about your business, your customers, and your goals. We talk about what services you offer, what areas you serve, and how customers find you today. No jargon. By the end, you have a clear plan for what your new site will look like and what it will do.',
    timeline: '30-min call',
  },
  {
    title: 'Design & Build',
    summary: 'We build with your input at every step.',
    detail: 'We design and build your site from scratch - no templates. You see progress along the way and give feedback before anything goes live. We handle the technical side (hosting, speed optimization, SEO setup) while you focus on making sure it looks right and says what you need it to say.',
    timeline: '1-3 weeks',
  },
  {
    title: 'Launch & Verify',
    summary: 'Your site goes live and we prove it performs.',
    detail: 'Your new site goes live with zero downtime. We verify every page loads fast, run it through Google PageSpeed to confirm scores, set up your analytics dashboard, and make sure your Google Business Profile is connected. You see the performance numbers on day one.',
    timeline: 'Launch day',
  },
  {
    title: 'Support & Optimize',
    summary: 'We keep improving it after launch.',
    detail: 'Every package includes post-launch support. We monitor your site speed, track which pages bring in the most leads, and make adjustments to improve results. You get regular updates showing how your site is performing. When your support period ends, your site keeps running - you can upgrade to managed support or self-manage.',
    timeline: 'Ongoing',
  },
]

export function InteractiveSteps() {
  const [openSteps, setOpenSteps] = useState<number[]>([0])

  const toggleStep = (index: number) => {
    setOpenSteps((prev) =>
      prev.includes(index)
        ? prev.filter((s) => s !== index)
        : [...prev, index]
    )
  }

  return (
    <div style={{ position: 'relative', paddingLeft: 32 }}>
      {/* Connecting line */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 15,
          top: 20,
          bottom: 20,
          width: 2,
          background: 'linear-gradient(180deg, var(--accent) 0%, var(--border-dashed) 100%)',
          opacity: 0.4,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {stepsData.map((step, i) => {
          const isOpen = openSteps.includes(i)
          return (
            <div key={step.title} style={{ position: 'relative', borderBottom: '1px dashed var(--border-dashed)' }}>
              {/* Numbered circle */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  left: -32,
                  top: 24,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  backgroundColor: isOpen ? 'var(--accent)' : 'var(--canvas-subtle)',
                  border: `2px solid ${isOpen ? 'var(--accent)' : 'var(--border-dashed)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: isOpen ? 'var(--text-on-accent)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.2s ease',
                  zIndex: 1,
                }}
              >
                {i + 1}
              </div>

              {/* Clickable header */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleStep(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleStep(i) } }}
                style={{
                  padding: '20px 0 0',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                  }}>
                    {step.summary}
                  </div>
                </div>
                <span
                  aria-hidden
                  style={{
                    color: 'var(--accent)',
                    fontSize: 18,
                    flexShrink: 0,
                    marginLeft: 16,
                    transition: 'transform 0.2s ease',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                >
                  +
                </span>
              </div>

              {/* Expandable detail - outside the clickable area */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.3s ease',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <div style={{
                    paddingTop: 12,
                    paddingBottom: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}>
                    <div style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                    }}>
                      {step.detail}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 12px',
                      borderRadius: 20,
                      backgroundColor: 'var(--canvas-subtle)',
                      border: '1px dashed var(--border-dashed)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--accent)',
                      fontFamily: 'var(--font-mono)',
                      alignSelf: 'flex-start',
                    }}>
                      {step.timeline}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
