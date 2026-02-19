/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
}

module.exports = nextConfig