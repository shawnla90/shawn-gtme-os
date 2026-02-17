import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@shawnos/shared'],
  output: 'standalone',
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
