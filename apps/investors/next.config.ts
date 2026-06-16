import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    outputFileTracingRoot: __dirname,
    images: {
          unoptimized: true,
    },
    turbopack: {
          root: path.join(__dirname, '..', '..'),
    },
}

export default nextConfig
