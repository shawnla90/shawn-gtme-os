import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@shawnos/shared'],
  output: 'standalone',
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
        source: '/content-wiki',
        destination: 'https://thecontentos.ai/content-wiki',
        permanent: true,
      },
      {
        source: '/content-wiki/:path*',
        destination: 'https://thecontentos.ai/content-wiki/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
