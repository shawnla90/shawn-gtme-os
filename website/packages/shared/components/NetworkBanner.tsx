import React from 'react'

type SiteKey = 'shawnos' | 'gtmos' | 'contentos'

interface NetworkBannerProps {
  currentSite: SiteKey
}

const sites: { key: SiteKey; label: string; url: string; accent: string }[] = [
  { key: 'shawnos', label: 'ShawnOS.ai', url: 'https://shawnos.ai', accent: 'var(--shawnos-green)' },
  { key: 'gtmos', label: 'theGTMOS.ai', url: 'https://thegtmos.ai', accent: 'var(--gtmos-teal)' },
  { key: 'contentos', label: 'theContentOS.ai', url: 'https://thecontentos.ai', accent: 'var(--contentos-purple)' },
]

export function NetworkBanner({ currentSite }: NetworkBannerProps) {
  return (
    <>
      <style>{`
        .network-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .network-link[data-accent="shawnos"]:hover { color: var(--shawnos-green); }
        .network-link[data-accent="gtmos"]:hover { color: var(--gtmos-teal); }
        .network-link[data-accent="contentos"]:hover { color: var(--contentos-purple); }
      `}</style>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          borderTop: '1px solid var(--border)',
          background: 'var(--canvas-subtle)',
        }}
      >
        {sites.map((site, i) => (
          <React.Fragment key={site.key}>
            {i > 0 && (
              <span style={{ color: 'var(--text-muted)' }}>|</span>
            )}
            {site.key === currentSite ? (
              <span style={{ color: site.accent, fontWeight: 600 }}>
                {site.label}
              </span>
            ) : (
              <a
                href={site.url}
                className="network-link"
                data-accent={site.key}
              >
                {site.label}
              </a>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  )
}
