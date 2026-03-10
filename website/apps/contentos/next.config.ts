import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@shawnos/shared'],
  output: 'standalone',
  outputFileTracingIncludes: {
    '/**': ['../../../data/**'],
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
}

export default nextConfig
