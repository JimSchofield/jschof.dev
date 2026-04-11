import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'assets/index.js',
    },
    rollupOptions: {
      external: (id) =>
        /^(lit|@lit\/)/.test(id),
    }
  }
})
