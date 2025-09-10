import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    reactCompiler: true,
    useCache: true,
    browserDebugInfoInTerminal: true,
    globalNotFound: true,
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
