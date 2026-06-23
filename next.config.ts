import type { NextConfig } from 'next'

// CSP shipped in Report-Only mode: violations are reported in the console but
// nothing is blocked. Once the report is clean, switch the header key to
// 'Content-Security-Policy' to enforce. Allowlists GTM / GA4 / Google Ads.
const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://www.google.com",
    "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.google-analytics.com https://www.googletagmanager.com https://stats.g.doubleclick.net",
    "frame-src https://www.googletagmanager.com https://td.doubleclick.net https://www.google.com",
].join('; ')

// Defense-in-depth headers applied to every route.
const securityHeaders = [
    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Content-Security-Policy-Report-Only', value: csp },
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
