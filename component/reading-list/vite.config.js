import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
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
