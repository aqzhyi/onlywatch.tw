import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.e2e.ts',
      ],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UseCatchAllNextParams',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'next/navigation'],
      output: {
        globals: {
          'react': 'React',
          'next/navigation': 'NextNavigation',
        },
      },
    },
    minify: false,
    sourcemap: true,
  },
})
