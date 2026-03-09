'use client'

import { MotionReveal, DashedCard } from '@shawnos/shared/components'
import type { TechStackTool } from './i18n/types'

/* ── Simple stroke-based icons ── */

function FrameworkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" y1="22" x2="12" y2="15.5" />
      <line x1="22" y1="8.5" x2="12" y2="15.5" />
      <line x1="2" y1="8.5" x2="12" y2="15.5" />
    </svg>
  )
}

function ServerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

function GitIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <line x1="6" y1="9" x2="6" y2="21" />
    </svg>
  )
}

const toolIcons = [FrameworkIcon, ServerIcon, ShieldIcon, ChartIcon, GitIcon]

interface TechStackProofProps {
  tools: TechStackTool[]
  verifyLink: string
}

export function TechStackProof({ tools, verifyLink }: TechStackProofProps) {
  return (
    <div>
      <div
        className="techstack-grid"
        style={{
          display: 'grid',
          gap: 16,
        }}
      >
        {tools.map((tool, i) => {
          const IconComponent = toolIcons[i]
          return (
            <MotionReveal key={tool.name}>
              <DashedCard style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                height: '100%',
              }}>
                <div style={{
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}>
                  {IconComponent && <IconComponent />}
                </div>
                <div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>
                    {tool.name}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    {tool.why}
                  </div>
                </div>
              </DashedCard>
            </MotionReveal>
          )
        })}
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: 32,
      }}>
        <a
          href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fshawnos.ai%2Fservices%2Fweb-development"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 14,
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 600,
            borderBottom: '1px dashed var(--accent)',
            paddingBottom: 2,
          }}
        >
          {verifyLink}
        </a>
      </div>

      <style>{`
        .techstack-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 600px) {
          .techstack-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .techstack-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
