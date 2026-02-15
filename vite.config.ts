import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));
const assetsPath = fileURLToPath(new URL('./src/assets', import.meta.url));
const scssPath = fileURLToPath(new URL('./src/scss', import.meta.url));

export default defineConfig({
  base: "/memory/",
  resolve: {
    alias: {
      '@': srcPath,
      '@assets': assetsPath,
      '@scss': scssPath
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [scssPath]
      }
    }
  },

  server: {
    open: true,
    port: 5173
  },

  build: {
    outDir: "dist",
    sourcemap: true
  }
});
