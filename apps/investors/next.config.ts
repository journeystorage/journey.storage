import type { NextConfig } from 'next'
import path from 'path'

const workspaceRoot = path.join(__dirname, '..', '..')

const nextConfig: NextConfig = {
            reactStrictMode: true,
            output: 'standalone',
            outputFileTracingRoot: workspaceRoot,
            images: {
                          unoptimized: true,
            },
            turbopack: {
                          root: workspaceRoot,
            },
}

export default nextConfig
