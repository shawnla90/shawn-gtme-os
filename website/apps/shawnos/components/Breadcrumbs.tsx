'use client'

// The visible "bread chrome" — SmoothUI breadcrumb bound to the app's i18n
// Link, mono-labeled to match the site's terminal chrome. Pair it with the
// JSON-LD BreadcrumbSchema (shared) which stays the SEO layer.
import Breadcrumb from './smoothui/breadcrumb'
import { Link } from '../i18n/navigation'
import type { ReactNode } from 'react'

export interface CrumbItem {
  label: string
  href?: string
}

function CrumbLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link href={href} className={className} style={{ textDecoration: 'none', color: 'inherit' }}>
      {children}
    </Link>
  )
}

export default function Breadcrumbs({ items }: { items: CrumbItem[] }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, marginBottom: 18 }}>
      <Breadcrumb
        items={[{ label: 'home', href: '/' }, ...items]}
        linkComponent={CrumbLink}
      />
    </div>
  )
}
