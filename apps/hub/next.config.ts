import path from 'path'
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // microphone=(self) — the hub's own voice input (ChatPanel mic) needs it.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // No `output: 'standalone'` here on purpose: the hub deploys on Vercel,
  // which manages its own output. Standalone + outputFileTracingRoot are the
  // Hostinger pattern (see DEPLOYMENT.md) and break Vercel's monorepo
  // output collection (ENOENT on /vercel/path0/.next).
  outputFileTracingRoot: path.join(__dirname, '..', '..'),
  turbopack: {
    root: path.join(__dirname, '..', '..'),
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
