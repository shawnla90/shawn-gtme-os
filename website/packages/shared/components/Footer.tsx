import React from 'react'

interface FooterProps {
  siteName?: string
}

const socialLinks = [
  { href: 'https://linkedin.com/in/shawntenam', label: 'LinkedIn' },
  { href: 'https://x.com/shawntenam', label: 'X' },
  { href: 'https://www.youtube.com/@ShawnOsAI', label: 'YouTube' },
  { href: 'https://www.tiktok.com/@shawnos.ai', label: 'TikTok' },
  { href: 'https://github.com/shawnla90', label: 'GitHub' },
  { href: 'https://reddit.com/r/GTMBuilders', label: 'Reddit' },
  { href: 'https://shawntenam.substack.com', label: 'Substack' },
  { href: 'https://discord.gg/6eKe49nth', label: 'Discord' },
]

export function Footer({ siteName }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ margin: '0 0 12px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p style={{ margin: '0 0 4px' }}>
          built in public.
        </p>
        <p style={{ margin: 0 }}>
          &copy; {year} {siteName ?? 'shawnos'}. all rights reserved.
        </p>
      </div>
    </footer>
  )
}
