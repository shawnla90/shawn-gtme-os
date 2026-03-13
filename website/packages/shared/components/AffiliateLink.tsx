/**
 * ShawnOS — Affiliate Link Component
 * Copyright (c) 2026 Shawn Tenam
 * Licensed under ShawnOS Proprietary License v1.0
 * See LICENSE for terms
 *
 * Transparent affiliate disclosure. Not sneaky. Not shilly.
 * Wraps any affiliate CTA with an honest heads-up.
 */

'use client'

import React from 'react'

/* ── styles ────────────────────────────────────────── */

const wrapStyle: React.CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
}

const disclosureStyle: React.CSSProperties = {
  fontSize: '11px',
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-muted)',
  opacity: 0.7,
  letterSpacing: '0.02em',
  lineHeight: 1.4,
  textAlign: 'center',
  maxWidth: 400,
}

const commentSlash: React.CSSProperties = {
  color: 'var(--text-muted)',
  opacity: 0.5,
}

/* ── component ─────────────────────────────────────── */

interface AffiliateLinkProps {
  href: string
  children: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

export function AffiliateLink({ href, children, style, className }: AffiliateLinkProps) {
  return (
    <span style={wrapStyle}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={style}
        className={className}
      >
        {children}
      </a>
      <span style={disclosureStyle}>
        <span style={commentSlash}>{'//'}</span>{' '}
        affiliate link - helps fund this site. click it, skip it, no difference to me.
      </span>
    </span>
  )
}

/**
 * Standalone disclosure for CTA banners where the link
 * is already rendered separately.
 */
export function AffiliateDisclosure() {
  return (
    <div style={{ ...disclosureStyle, marginTop: '12px' }}>
      <span style={commentSlash}>{'//'}</span>{' '}
      affiliate link - helps fund this site. click it, skip it, no difference to me.
    </div>
  )
}
