import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: true,
    allowedHosts: [
      'sandworm-sevenfold-dreamy.ngrok-free.dev',
      'seam.com.br',
    ],

    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (error, _request, response) => {
            console.error('Vite API proxy error:', error.message);

            if (response.destroyed) {
              return;
            }

            if (response.headersSent) {
              response.end();
              return;
            }

            response.writeHead(503, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'API temporariamente indisponível' }));
          });
        },
      },
    },
  },

  preview: {
    host: true,
    allowedHosts: [
      'sandworm-sevenfold-dreamy.ngrok-free.dev',
      'seam.com.br',
    ],
  },
});
