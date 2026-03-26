import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));
const assetsPath = fileURLToPath(new URL('./src/assets', import.meta.url));
const scssPath = fileURLToPath(new URL('./src/scss', import.meta.url));
const indexHtml = fileURLToPath(new URL('./index.html', import.meta.url));
const settingsHtml = fileURLToPath(new URL('./settings.html', import.meta.url));
const gameHtml = fileURLToPath(new URL('./game.html', import.meta.url));
const legalNoticeHtml = fileURLToPath(new URL('./legal-notice.html', import.meta.url));
const privacyPolicyHtml = fileURLToPath(new URL('./privacy-policy.html', import.meta.url));

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
    sourcemap: true,
    rollupOptions: {
      input: {
        index: indexHtml,
        settings: settingsHtml,
        game: gameHtml,
        "legal-notice": legalNoticeHtml,
        "privacy-policy": privacyPolicyHtml
      }
    }
  }
});
