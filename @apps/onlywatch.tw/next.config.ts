import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    reactCompiler: true,
    useCache: true,
    browserDebugInfoInTerminal: true,
    devtoolSegmentExplorer: true,
    globalNotFound: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/calendar',
      },
    ]
  },
}

export default nextConfig
