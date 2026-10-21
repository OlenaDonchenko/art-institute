import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // The AIC image server blocks requests without an AIC-User-Agent header,
      // and <img> tags can't send custom headers, so the dev server adds it.
      '/iiif': {
        target: 'https://www.artic.edu',
        changeOrigin: true,
        headers: { 'AIC-User-Agent': 'art-institute-demo' },
      },
    },
  },
});
