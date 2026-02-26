/* ── BuiltWithStrip ────────────────────────────────────────────────────────
 * Partner + tech logo strip for the GTMOS homepage.
 * SVG paths from SimpleIcons (CC0) where available - viewBox="0 0 24 24"
 * For partners without SimpleIcons: first-letter glyph marks.
 * Pure CSS hover - no client-side JS required.
 * ────────────────────────────────────────────────────────────────────── */

interface BuiltWithLogo {
  name: string
  path?: string
  letter?: string
  imageSrc?: string
  brandColor: string
}

const logos: BuiltWithLogo[] = [
  {
    name: 'Clay',
    brandColor: '#4B5CFA',
    imageSrc: '/brands/clay-creator-badge.png',
  },
  {
    name: 'Grow with Clay',
    brandColor: '#4B5CFA',
    imageSrc: '/brands/grow_with_clay_logo.jpeg',
  },
  {
    name: 'Instantly',
    brandColor: '#5B7FFF',
    imageSrc: '/brands/instantlyapp_logo.jpeg',
  },
  {
    name: 'HeyReach',
    brandColor: '#7C3AED',
    imageSrc: '/brands/heyreachio_logo.jpeg',
  },
  {
    name: 'Firecrawl',
    brandColor: '#FF6B35',
    imageSrc: '/brands/firecrawl_logo.jpeg',
  },
  {
    name: 'Exa',
    brandColor: '#7C3AED',
    imageSrc: '/brands/exa_ai_logo.jpeg',
  },
  {
    name: 'HubSpot',
    brandColor: '#FF5C35',
    path: 'M16.75 5.01V1.86c.6-.29 1.01-.89 1.01-1.56 0-.97-.78-1.75-1.75-1.75s-1.75.78-1.75 1.75c0 .67.42 1.27 1.01 1.56v3.13c-1.23.18-2.36.72-3.27 1.51l-8.6-6.7a2.28 2.28 0 0 0 .06-.52C3.46 1.02 2.44 0 1.18 0S-1.09 1.02-1.09 2.28c0 1.26 1.02 2.28 2.28 2.28.32 0 .63-.07.91-.19l8.44 6.57c-.73 1.1-1.16 2.42-1.16 3.83 0 1.54.51 2.96 1.36 4.1l-1.6 1.6a1.72 1.72 0 0 0-.5-.08c-.95 0-1.71.77-1.71 1.71 0 .95.77 1.71 1.71 1.71s1.71-.77 1.71-1.71c0-.17-.03-.34-.08-.5l1.58-1.58a7.24 7.24 0 0 0 4.16 1.31c4.01 0 7.25-3.25 7.25-7.25 0-3.63-2.67-6.63-6.15-7.17zm-.74 11.42c-2.35 0-4.25-1.9-4.25-4.25s1.9-4.25 4.25-4.25 4.25 1.9 4.25 4.25-1.9 4.25-4.25 4.25z',
  },
  {
    name: 'Salesforce',
    brandColor: '#00A1E0',
    path: 'M10.006 3.907a4.726 4.726 0 0 1 3.946-2.12c1.79 0 3.353 1.003 4.148 2.477A5.073 5.073 0 0 1 20.2 3.6c2.81 0 5.09 2.28 5.09 5.09s-2.28 5.09-5.09 5.09a5.04 5.04 0 0 1-1.618-.266 4.247 4.247 0 0 1-3.905 2.576 4.22 4.22 0 0 1-2.137-.578 4.598 4.598 0 0 1-4.19 2.718 4.607 4.607 0 0 1-4.368-3.148A3.857 3.857 0 0 1 1.01 15.04 3.867 3.867 0 0 1-.35 12.093a3.86 3.86 0 0 1 2.199-3.483 4.57 4.57 0 0 1-.313-1.66A4.573 4.573 0 0 1 6.106 2.38a4.56 4.56 0 0 1 3.9 1.527z',
  },
  {
    name: 'InboxKit',
    brandColor: '#FF4F64',
    imageSrc: '/brands/inbox_automate_mail_logo.jpeg',
  },
  {
    name: 'Supabase',
    brandColor: '#3ECF8E',
    imageSrc: '/brands/supabase_logo.jpeg',
  },
  {
    name: 'Next.js',
    brandColor: '#ffffff',
    path: 'M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z',
  },
  {
    name: 'Vercel',
    brandColor: '#ffffff',
    path: 'm12 1.608 12 20.784H0Z',
  },
  {
    name: 'Claude',
    brandColor: '#D97757',
    path: 'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z',
  },
]

function MiniLogo({ logo }: { logo: BuiltWithLogo }) {
  return (
    <div
      className="builtwith-logo"
      style={{ '--brand-color': logo.brandColor } as React.CSSProperties}
    >
      {logo.imageSrc ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logo.imageSrc}
          alt={logo.name}
          width={40}
          height={40}
          style={{ borderRadius: 8, objectFit: 'contain' }}
        />
      ) : logo.path ? (
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
        built with
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
