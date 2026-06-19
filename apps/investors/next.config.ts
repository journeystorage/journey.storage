import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
              reactStrictMode: true,
              output: 'standalone',
              outputFileTracingRoot: __dirname,
              images: {
                              unoptimized: true,
              },
  async rewrites() {
    return [
      { source: '/deck/springfield', destination: '/deck/springfield/index.html' },
    ]
  },
}

export default nextConfig
