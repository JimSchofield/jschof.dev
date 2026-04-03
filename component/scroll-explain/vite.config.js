import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    fs: {
      allow: ['..'],
    }
  },
  build: {
    rollupOptions: {
      input: 'src/index.ts',
      external: (id) =>
        /^(lit|@lit\/)/.test(id),
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
