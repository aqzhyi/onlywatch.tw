import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    reactCompiler: true,
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
  redirects: async () => {
    return [
      // 首頁重定向到日曆頁面
      {
        source: '/',
        destination: '/calendar',
        permanent: false, // 使用 302 臨時重定向，方便未來調整
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/features/i18n/request.ts',
})

export default withNextIntl(nextConfig)
