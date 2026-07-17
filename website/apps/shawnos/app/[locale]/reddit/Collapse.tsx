'use client'

import React, { useState } from 'react'

interface CollapseProps {
  label: string
  sublabel?: string
  children: React.ReactNode
}

/**
 * Lightweight expandable used for evidence drill-downs on the report page.
 *
 * Children stay mounted and are hidden with CSS rather than unmounted. The
 * receipts are the reason to trust the page, and `{open && children}` kept them
 * out of the DOM entirely: invisible to search, to crawlers, to AI answer
 * engines, and to anyone following a deep link (the client docs link straight
 * to #the-ask, whose receipt sat behind one of these). `hidden` keeps the
 * collapsed default while leaving the content real.
 */
export function Collapse({ label, sublabel, children }: CollapseProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setOpen(!open)} style={toggleBtn} aria-expanded={open}>
        <span style={toggleLabel}>
          {open ? '▾' : '▸'} {label}
        </span>
        {sublabel && <span style={toggleSub}>{sublabel}</span>}
      </button>
      <div hidden={!open} style={{ marginTop: '14px' }}>
        {children}
      </div>
    </div>
  )
}

/* ── styles ─────────────────────────────────────────── */

const toggleBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '12px',
  width: '100%',
  padding: '12px 16px',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  cursor: 'pointer',
  fontFamily: 'var(--font-editorial-body)',
  textAlign: 'left',
}

const toggleLabel: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-display)',
  fontSize: '15px',
  fontWeight: 500,
  color: 'var(--text-primary)',
  letterSpacing: '-0.01em',
  minWidth: 0,
}

/**
 * No nowrap. It suited the short chip this was built for ("r/x · 12K views")
 * and broke once sublabels started carrying thread titles: on a phone the
 * span refused to wrap and pushed the whole document ~120px wide.
 */
const toggleSub: React.CSSProperties = {
  fontFamily: 'var(--font-editorial-body)',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--rr-accent)',
  minWidth: 0,
}
