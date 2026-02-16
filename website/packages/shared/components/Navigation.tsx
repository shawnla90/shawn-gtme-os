import React from 'react'

interface NavLink {
  href: string
  label: string
}

interface NavigationProps {
  siteName: string
  links?: NavLink[]
}

const defaultLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/vitals', label: 'Vitals' },
  { href: '/about', label: 'About' },
]

export function Navigation({ siteName, links = defaultLinks }: NavigationProps) {
  return (
    <>
      <style>{`
        .nav-link {
          color: var(--text-secondary);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .nav-link:hover {
          color: var(--accent);
        }
      `}</style>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Logo / Site name */}
        <a
          href="/"
          style={{
            color: 'var(--accent)',
            fontSize: '18px',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          {siteName}
        </a>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
