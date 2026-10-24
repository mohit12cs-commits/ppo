import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-server-middleware',
      async configureServer(server) {
        process.env.VITE_DEV_MIDDLEWARE = 'true';
        try {
          const { default: app } = await import('./server.ts');
          server.middlewares.use(app);
          console.log('✓ In-Vite API server middleware initialized');
        } catch (err) {
          console.warn('In-Vite API middleware fallback to proxy:', err);
        }
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
