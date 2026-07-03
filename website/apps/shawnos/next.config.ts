import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  transpilePackages: ['@shawnos/shared'],
  output: 'standalone',
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
        source: '/clearbox',
        destination: 'https://clearbox.to',
        permanent: true,
      },
      {
        source: '/:locale(en|es|he|ja|zh)/clearbox',
        destination: 'https://clearbox.to',
        permanent: true,
      },
      {
        source: '/knowledge/gtm',
        destination: '/knowledge',
        permanent: true,
      },
      {
        source: '/content-wiki',
        destination: '/knowledge',
        permanent: true,
      },
      {
        source: '/content-wiki/:path*',
        destination: '/knowledge',
        permanent: true,
      },
      {
        source: '/clay-wiki',
        destination: '/knowledge',
        permanent: true,
      },
      {
        source: '/clay-wiki/:path*',
        destination: '/knowledge',
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
