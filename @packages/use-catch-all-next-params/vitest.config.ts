import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'e2e/**',
        'dist/**',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'vitest.setup.ts',
        '.*rc.mjs',
        '.*rc.ts',
        '*.config.ts',
        '*.config.mjs',
      ],
    },
  },
})
