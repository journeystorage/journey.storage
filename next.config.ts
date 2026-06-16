import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    outputFileTracingRoot: __dirname,
    images: {
          unoptimized: true,
    },
    turbopack: {
          root: __dirname,
    },
}

export default nextConfig
