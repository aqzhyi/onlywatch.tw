import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm'],
  dts: true,
  external: ['react', 'next/navigation'],
  sourcemap: true,
  minify: false,
  outDir: 'dist',
})
