import { resolve } from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  turbopack: {
    root: resolve(__dirname, '..', '..'),
  },
}

export default nextConfig
