import type { NextConfig } from 'next'

// Defense-in-depth headers applied to every route. (CSP is intentionally
// omitted for now — it needs careful allowlisting of GTM/GA/Ads inline scripts
// and a report-only rollout; tracked as a follow-up.)
const securityHeaders = [
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    output: 'standalone',
    outputFileTracingRoot: __dirname,
    images: {
          unoptimized: true,
    },
    turbopack: {
          root: __dirname,
    },
    async headers() {
        return [{ source: '/:path*', headers: securityHeaders }]
    },
}

export default nextConfig
