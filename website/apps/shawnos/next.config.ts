import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@shawnos/shared'],
  output: 'standalone',
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
        source: '/arc',
        destination: '/about/arc',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
