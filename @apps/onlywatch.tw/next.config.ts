import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    useCache: true,
    browserDebugInfoInTerminal: true,
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'profile.line-scdn.net',
        port: '',
        pathname: '/**', // 允許 Line 頭像路徑
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**', // 允許 Google 頭像路徑
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/features/i18n/request.ts',
})

export default withNextIntl(nextConfig)
