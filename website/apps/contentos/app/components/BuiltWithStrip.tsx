/* ── BuiltWithStrip ────────────────────────────────────────────────────────
 * Content platform logo strip for the ContentOS homepage.
 * SVG paths from SimpleIcons (CC0) where available - viewBox="0 0 24 24"
 * For platforms without SimpleIcons: first-letter glyph marks.
 * Pure CSS hover - no client-side JS required.
 * ────────────────────────────────────────────────────────────────────── */

interface BuiltWithLogo {
  name: string
  path?: string
  letter?: string
  brandColor: string
}

const logos: BuiltWithLogo[] = [
  {
    name: 'LinkedIn',
    brandColor: '#0A66C2',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    name: 'Substack',
    brandColor: '#FF6719',
    path: 'M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z',
  },
  {
    name: 'X',
    brandColor: '#ffffff',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  {
    name: 'TikTok',
    brandColor: '#FF004F',
    path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    name: 'YouTube',
    brandColor: '#FF0000',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    name: 'Figma',
    brandColor: '#F24E1E',
    path: 'M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 8.943h-4.588c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.943H8.148zm4.587 15.057h-4.588c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V16.49H8.148zm15.704-7.547c0 2.476-2.014 4.49-4.49 4.49-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.49 2.014 4.49 4.49zm-1.471 0c0-1.665-1.355-3.019-3.019-3.019s-3.019 1.355-3.019 3.019 1.355 3.019 3.019 3.019 3.019-1.355 3.019-3.019z',
  },
  {
    name: 'Typefully',
    brandColor: '#3B82F6',
    letter: 'T',
  },
  {
    name: 'Canva',
    brandColor: '#00C4CC',
    path: 'M18.89 13.87c-.22 0-.39.18-.5.36-.5.81-1.17 1.36-1.87 1.36-1.09 0-1.72-1.31-1.86-3.33-.06-.88-.08-1.82-.08-2.8 0-2.11.14-3.58.81-3.58.3 0 .55.32.55.68 0 .11-.02.22-.07.35-.06.17-.09.34-.09.5 0 .67.5 1.18 1.2 1.18.73 0 1.28-.59 1.28-1.4 0-1.27-1.17-2.29-2.72-2.29-3.09 0-5.33 3.22-5.33 6.87 0 3.04 1.67 5.17 4.22 5.17 1.94 0 3.56-1.36 4.26-2.93a.51.51 0 0 0 .06-.22c0-.1-.04-.18-.14-.18-.07.01-.11.05-.11.07-.26.26zm-6.41 3.48c-3.32 0-4.72-3.14-4.72-5.93 0-4.06 2.78-7.17 5.66-8.96 2.53-1.56 5.16-2.18 7.3-2.18 2.12 0 3.63.61 4.3 1.89.39.74.56 1.56.56 2.42 0 4.95-5.27 8.57-7.34 8.57-.73 0-1.14-.39-1.14-.95 0-.12.02-.23.07-.35.31-1.09.47-2.12.47-3.05 0-3.3-1.5-5.82-3.59-5.82-1.67 0-3.09 1.42-3.09 4.2 0 3.23 1.73 6.45 4.87 6.45.33 0 .67-.05 1-.14.11-.03.19-.05.26-.05.08 0 .12.04.12.12 0 .15-.21.36-.52.54-1.04.61-2.48.97-3.59.97-.2 0-.41-.01-.62-.04v.01z',
  },
]

function MiniLogo({ logo }: { logo: BuiltWithLogo }) {
  return (
    <div
      className="builtwith-logo"
      style={{ '--brand-color': logo.brandColor } as React.CSSProperties}
    >
      {logo.path ? (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          width={40}
          height={40}
          role="img"
          aria-label={logo.name}
        >
          <path d={logo.path} />
        </svg>
      ) : (
        <div
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: logo.letter && logo.letter.length > 1 ? '14px' : '20px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            borderRadius: 8,
            border: '1.5px solid currentColor',
            background: `color-mix(in srgb, ${logo.brandColor} 8%, transparent)`,
            opacity: 0.85,
          }}
          role="img"
          aria-label={logo.name}
        >
          {logo.letter}
        </div>
      )}
      <span className="builtwith-label">
        {logo.name}
      </span>
    </div>
  )
}

export function BuiltWithStrip() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        padding: '20px 24px',
        background: 'var(--canvas-subtle)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        marginBottom: 24,
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        platforms
      </span>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '24px',
          flexWrap: 'wrap',
        }}
      >
        {logos.map((logo) => (
          <MiniLogo key={logo.name} logo={logo} />
        ))}
      </div>
    </div>
  )
}
