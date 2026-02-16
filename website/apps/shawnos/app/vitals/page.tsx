import type { Metadata } from 'next'
import { getWebsiteStats, resolveDataRoot } from '@shawnos/shared/lib'
import { VitalsPage } from '@shawnos/shared/pages/VitalsPage'
import { BreadcrumbSchema } from '@shawnos/shared/components'

const DATA_ROOT = resolveDataRoot()

export const metadata: Metadata = {
  title: 'System Vitals',
  description:
    'Live system scan of the ShawnOS website ecosystem. Code depth, technical features, and the Nio website guardian.',
  keywords: [
    'developer portfolio stats',
    'code metrics dashboard',
    'website ecosystem scanner',
    'monorepo statistics',
    'technical portfolio vitals',
    'live code depth analysis',
    'build in public metrics',
    'developer output dashboard',
    'Next.js site statistics',
    'open source project stats',
  ],
  alternates: { canonical: 'https://shawnos.ai/vitals' },
  openGraph: {
    title: 'System Vitals | shawnos.ai',
    description:
      'Live system scan of the ShawnOS website ecosystem. Code depth, technical features, and the Nio website guardian.',
    url: 'https://shawnos.ai/vitals',
    images: [
      {
        url: '/og?title=System+Vitals&subtitle=Live+ecosystem+scan',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    title: 'System Vitals | shawnos.ai',
    description:
      'Live system scan of the ShawnOS website ecosystem.',
    images: ['/og?title=System+Vitals&subtitle=Live+ecosystem+scan'],
  },
}

export default function VitalsRoute() {
  const stats = getWebsiteStats(DATA_ROOT)

  if (!stats) {
    return (
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          padding: '80px 20px',
          fontFamily: 'var(--font-mono)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent)' }}>$</span> ./vitals --scan-all
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: '13px',
            color: 'var(--text-muted)',
            opacity: 0.7,
          }}
        >
          {'> scanner not initialized. run website_scanner.py first.'}
        </div>
      </div>
    )
  }

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Vitals', url: 'https://shawnos.ai/vitals' }]} />
      <VitalsPage stats={stats} />
    </>
  )
}
