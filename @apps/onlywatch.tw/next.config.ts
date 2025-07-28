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
        destination: '/calender',
      },
    ]
  },
}

export default nextConfig
