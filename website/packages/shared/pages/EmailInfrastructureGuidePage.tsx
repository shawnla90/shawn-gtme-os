'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import {
  EMAIL_CATEGORIES,
  INBOX_KIT_AFFILIATE_LINK,
} from '../data/email-infrastructure'

/* ── styles ──────────────────────────────────────── */

const pageWrapper: React.CSSProperties = {
  maxWidth: 1040,
  margin: '0 auto',
  padding: '40px 20px 60px',
  fontFamily: 'var(--font-mono)',
}

const terminalHeader: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 400,
  color: 'var(--text-muted)',
  marginBottom: '32px',
}

const heroTitle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '16px',
  lineHeight: 1.3,
}

const heroBody: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.75,
  color: 'var(--text-secondary)',
  marginBottom: '12px',
  maxWidth: 720,
}

const heroMuted: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-muted)',
  marginBottom: '32px',
  maxWidth: 720,
}

const twoColumnLayout: React.CSSProperties = {
  display: 'flex',
  gap: '48px',
  alignItems: 'flex-start',
}

const mainContent: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  maxWidth: 720,
}

const tocSidebar: React.CSSProperties = {
  width: 240,
  flexShrink: 0,
  position: 'sticky' as const,
  top: 24,
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto' as const,
}

const tocTitle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid var(--border)',
}

const tocCategoryLink: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  padding: '4px 0',
  marginTop: '12px',
  transition: 'color 0.15s ease',
}

const tocTermLink: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--text-muted)',
  textDecoration: 'none',
  padding: '2px 0 2px 12px',
  transition: 'color 0.15s ease',
  borderLeft: '1px solid transparent',
}

const divider: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid var(--border)',
  margin: '48px 0',
}

const sectionPrompt: React.CSSProperties = {
  fontSize: '13px',
  color: 'var(--accent)',
  fontWeight: 400,
  letterSpacing: '0.5px',
  marginBottom: '16px',
  fontFamily: 'var(--font-mono)',
}

const categoryTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: '24px',
  lineHeight: 1.3,
}

const termCard: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
  transition: 'border-color 0.15s ease',
}

const termName: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '8px',
  letterSpacing: '0.02em',
}

const termDefinition: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.65,
  color: 'var(--text-primary)',
  marginBottom: '12px',
  fontWeight: 500,
}

const termLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  marginBottom: '4px',
  marginTop: '12px',
}

const termBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  margin: 0,
}

const relatedList: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: '6px',
  marginTop: '12px',
}

const relatedTag: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--text-muted)',
  background: 'var(--canvas)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  padding: '2px 8px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease, color 0.15s ease',
  cursor: 'pointer',
}

const backLink: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--accent)',
  textDecoration: 'none',
}

const ctaBlock: React.CSSProperties = {
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--accent)',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
}

const ctaTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: '8px',
}

const ctaBody: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: 1.65,
  color: 'var(--text-secondary)',
  marginBottom: '16px',
}

const ctaLink: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 22px',
  fontSize: '13px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--canvas)',
  background: 'var(--accent)',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  textDecoration: 'none',
  transition: 'opacity 0.15s ease',
}

const ctaSecondary: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 18px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 6,
  textDecoration: 'none',
  marginTop: '10px',
  transition: 'border-color 0.15s ease',
}

const mobileTocToggle: React.CSSProperties = {
  display: 'none',
  width: '100%',
  padding: '10px 16px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'var(--font-mono)',
  color: 'var(--accent)',
  background: 'var(--canvas-subtle)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left' as const,
  marginBottom: '16px',
}

/* ── Component ───────────────────────────────────── */

export function EmailInfrastructureGuidePage() {
  const [activeId, setActiveId] = useState<string>('')
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const allIds = EMAIL_CATEGORIES.flatMap((cat) => [
    cat.id,
    ...cat.terms.map((t) => t.id),
  ])

  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 24
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setMobileTocOpen(false)
  }, [])

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    const visibleEntries = new Map<string, boolean>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleEntries.set(entry.target.id, entry.isIntersecting)
        })

        for (const id of allIds) {
          if (visibleEntries.get(id)) {
            setActiveId(id)
            return
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    )

    allIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const termNameMap = new Map<string, string>()
  EMAIL_CATEGORIES.forEach((cat) =>
    cat.terms.forEach((t) => termNameMap.set(t.id, t.name)),
  )

  const termCount = EMAIL_CATEGORIES.reduce((n, c) => n + c.terms.length, 0)

  /** Render term name — Inbox Kit gets an affiliate link */
  const renderTermName = (term: { id: string; name: string }) => {
    if (term.id === 'inbox-kit') {
      return (
        <>
          <a
            href={INBOX_KIT_AFFILIATE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor =
                'var(--accent)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
            }}
          >
            {term.name} ↗
          </a>
        </>
      )
    }

    return (
      <Link
        href={`/knowledge/${term.id}`}
        style={{
          color: 'inherit',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
        }}
      >
        {term.name} &rarr;
      </Link>
    )
  }

  return (
    <>
      <style>{`
        .ei-blink {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: var(--accent);
          vertical-align: text-bottom;
          margin-left: 2px;
          animation: ei-blink-kf 1s step-end infinite;
        }
        @keyframes ei-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .ei-term-card:hover {
          border-color: var(--accent) !important;
        }
        .ei-related-tag:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }
        .ei-toc-cat:hover { color: var(--accent) !important; }
        .ei-toc-term:hover {
          color: var(--text-secondary) !important;
          border-left-color: var(--border) !important;
        }
        .ei-toc-active-cat { color: var(--accent) !important; }
        .ei-toc-active-term {
          color: var(--accent) !important;
          border-left-color: var(--accent) !important;
        }
        @media (max-width: 820px) {
          .ei-two-col { flex-direction: column !important; }
          .ei-toc-sidebar { display: none !important; }
          .ei-mobile-toc-toggle { display: block !important; }
          .ei-mobile-toc-content {
            background: var(--canvas-subtle);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 24px;
          }
        }
        @media (min-width: 821px) {
          .ei-mobile-toc-toggle { display: none !important; }
          .ei-mobile-toc-content { display: none !important; }
        }
        .ei-toc-sidebar::-webkit-scrollbar { width: 4px; }
        .ei-toc-sidebar::-webkit-scrollbar-track { background: transparent; }
        .ei-toc-sidebar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }
      `}</style>

      <div style={pageWrapper}>
        {/* ── Terminal header ── */}
        <h1 style={terminalHeader}>
          <span style={{ color: 'var(--accent)' }}>$</span> cat
          ~/gtm-os/email-infrastructure.md
          <span className="ei-blink" />
        </h1>

        {/* ── Hero ── */}
        <section>
          <h2 style={heroTitle}>Email Infrastructure Guide</h2>
          <p style={heroBody}>
            the best email in the world doesn&apos;t matter if no one sees it.
          </p>
          <p style={heroBody}>
            before you write a single line of copy, before you test a single
            subject line, before you optimize send times &mdash; the plumbing
            has to work. domains, DNS records, inbox providers, warmup, rotation,
            sending limits. this is the infrastructure layer that determines
            whether your email lands in the inbox or the spam folder. get this
            right and average copy delivers. get this wrong and the best copy
            in the world disappears.
          </p>
          <p style={heroMuted}>
            {EMAIL_CATEGORIES.length} categories &middot; {termCount} terms
            &middot; from the builder side
          </p>
        </section>

        <hr style={divider} />

        {/* ── Mobile TOC toggle ── */}
        <button
          className="ei-mobile-toc-toggle"
          style={mobileTocToggle}
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
        >
          {mobileTocOpen ? '\u25BE' : '\u25B8'} table of contents
        </button>

        {mobileTocOpen && (
          <nav className="ei-mobile-toc-content">
            {EMAIL_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleScrollTo(cat.id)
                  }}
                  style={{
                    ...tocCategoryLink,
                    color:
                      activeId === cat.id
                        ? 'var(--accent)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {cat.name}
                </a>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {cat.terms.map((term) => (
                    <li key={term.id}>
                      <a
                        href={`#${term.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleScrollTo(term.id)
                        }}
                        style={{
                          ...tocTermLink,
                          color:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'var(--text-muted)',
                          borderLeftColor:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'transparent',
                        }}
                      >
                        {term.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}

        {/* ── Two-column layout ── */}
        <div className="ei-two-col" style={twoColumnLayout}>
          {/* ── Main content ── */}
          <main style={mainContent}>
            {EMAIL_CATEGORIES.map((cat, catIdx) => (
              <React.Fragment key={cat.id}>
                <section id={cat.id}>
                  <div style={sectionPrompt}>{cat.prompt}</div>
                  <h2 style={categoryTitle}>{cat.name}</h2>

                  {cat.terms.map((term) => (
                    <div
                      key={term.id}
                      id={term.id}
                      className="ei-term-card"
                      style={termCard}
                    >
                      <h3 style={termName}>{renderTermName(term)}</h3>
                      <p style={termDefinition}>{term.definition}</p>

                      <div style={termLabel}>Why it matters</div>
                      <p style={termBody}>{term.whyItMatters}</p>

                      <div style={termLabel}>How I use it</div>
                      <p style={termBody}>{term.howYouUseIt}</p>

                      {term.related.length > 0 && (
                        <div style={relatedList}>
                          {term.related.map((relId) => {
                            const name = termNameMap.get(relId)
                            if (!name) return null
                            return (
                              <a
                                key={relId}
                                href={`#${relId}`}
                                className="ei-related-tag"
                                style={relatedTag}
                                onClick={(e) => {
                                  e.preventDefault()
                                  handleScrollTo(relId)
                                }}
                              >
                                {name}
                              </a>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </section>

                {catIdx < EMAIL_CATEGORIES.length - 1 && (
                  <hr style={divider} />
                )}
              </React.Fragment>
            ))}

            <hr style={divider} />

            {/* ── Closing + CTA ── */}
            <section>
              <div style={sectionPrompt}>$ ./build --send</div>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  marginBottom: '16px',
                }}
              >
                the basics beat the hacks every time. get the infrastructure
                up, get the domains warmed, get the contacts loaded, and send.
              </p>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.65,
                  color: 'var(--text-muted)',
                  marginBottom: '32px',
                }}
              >
                if you can read these terms and see how they connect &mdash; how
                DNS records feed deliverability, how MX records drive routing,
                how warmup protects reputation, how rotation extends
                infrastructure lifespan &mdash; you&apos;re ready to build email
                infrastructure that actually works. stop optimizing what
                doesn&apos;t matter yet. fix the plumbing first.
              </p>

              <div style={ctaBlock}>
                <div style={ctaTitle}>
                  See the GTM terms that use this infrastructure
                </div>
                <p style={ctaBody}>
                  Sequences, enrichment, routing, qualification &mdash; the
                  campaign-level terms that plug into the infrastructure you
                  just learned.
                </p>
                <Link href="/knowledge/gtm" style={ctaLink}>
                  GTM knowledge guide &rarr;
                </Link>
                <br />
                <Link href="/clay-wiki" style={ctaSecondary}>
                  Clay Wiki &rarr;
                </Link>
              </div>
            </section>

            {/* ── Navigation ── */}
            <div
              style={{
                marginTop: '48px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <Link href="/knowledge/gtm" style={backLink}>
                &larr; GTM knowledge guide
              </Link>
              <Link href="/clay-wiki" style={backLink}>
                Clay Wiki &rarr;
              </Link>
            </div>
          </main>

          {/* ── Sticky TOC sidebar ── */}
          <nav className="ei-toc-sidebar" style={tocSidebar}>
            <div style={tocTitle}>On this page</div>
            {EMAIL_CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <a
                  href={`#${cat.id}`}
                  className={`ei-toc-cat ${activeId === cat.id ? 'ei-toc-active-cat' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    handleScrollTo(cat.id)
                  }}
                  style={{
                    ...tocCategoryLink,
                    color:
                      activeId === cat.id
                        ? 'var(--accent)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {cat.name}
                </a>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {cat.terms.map((term) => (
                    <li key={term.id}>
                      <a
                        href={`#${term.id}`}
                        className={`ei-toc-term ${activeId === term.id ? 'ei-toc-active-term' : ''}`}
                        onClick={(e) => {
                          e.preventDefault()
                          handleScrollTo(term.id)
                        }}
                        style={{
                          ...tocTermLink,
                          color:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'var(--text-muted)',
                          borderLeftColor:
                            activeId === term.id
                              ? 'var(--accent)'
                              : 'transparent',
                        }}
                      >
                        {term.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
