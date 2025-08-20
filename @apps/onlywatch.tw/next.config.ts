import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    // reactCompiler: { compilationMode: 'annotation' },
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
