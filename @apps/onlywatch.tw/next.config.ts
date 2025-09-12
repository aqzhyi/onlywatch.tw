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
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**', // 限制只允許 Google 頭像路徑
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: '/query/:query',
        destination: '/calendar/:query',
      },
      {
        source: '/:query*',
        destination: '/calendar/query/:query*',
      },
    ]
  },
}

export default nextConfig
