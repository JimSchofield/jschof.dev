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
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})
