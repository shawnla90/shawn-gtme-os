/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  serverExternalPackages: ['better-sqlite3', 'graphology', 'graphology-layout-forceatlas2'],
  transpilePackages: ['@hypernovum/core', '@shawnos/shared'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
