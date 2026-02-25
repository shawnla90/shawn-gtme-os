/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  serverExternalPackages: ['better-sqlite3'],
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig