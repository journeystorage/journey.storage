import { resolve } from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: resolve(__dirname, '..', '..'),
  },
}

export default nextConfig
