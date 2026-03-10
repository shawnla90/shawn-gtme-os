import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  transpilePackages: ['@shawnos/shared'],
  output: 'standalone',
  outputFileTracingIncludes: {
    '/**': ['../../../data/**'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/knowledge/gtm',
        destination: 'https://thegtmos.ai/knowledge/gtm',
        permanent: true,
      },
      {
        source: '/content-wiki',
        destination: 'https://thecontentos.ai/content-wiki',
        permanent: true,
      },
      {
        source: '/content-wiki/:path*',
        destination: 'https://thecontentos.ai/content-wiki/:path*',
        permanent: true,
      },
      {
        source: '/clay-wiki',
        destination: 'https://thegtmos.ai/clay-wiki',
        permanent: true,
      },
      {
        source: '/clay-wiki/:path*',
        destination: 'https://thegtmos.ai/clay-wiki/:path*',
        permanent: true,
      },
      {
        source: '/arc',
        destination: '/about/arc',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
