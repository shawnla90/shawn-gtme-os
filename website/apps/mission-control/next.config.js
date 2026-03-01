const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  serverExternalPackages: ['better-sqlite3', 'graphology', 'graphology-layout-forceatlas2'],
  transpilePackages: ['@hypernovum/core', '@shawnos/shared'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Ensure data/*.db files are included in the Vercel serverless function bundle
  outputFileTracingIncludes: {
    '/api/**': [path.join('..', '..', '..', 'data', '*.db')],
  },
}

module.exports = nextConfig
