import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@shawnos/shared', 'react-markdown', 'remark-gfm', 'rehype-highlight'],
  output: 'standalone',
  devIndicators: false,
}

export default nextConfig
