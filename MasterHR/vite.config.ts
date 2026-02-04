import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type ProxyOptions } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';

type ProxyType = Record<string, string | ProxyOptions> | undefined;
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isAnalyser = env.ANALYZE === 'true';
  const isDevelopment = mode === 'development';

  const proxy: ProxyType = isDevelopment
    ? {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      }
    : undefined;

  return {
    plugins: [react(), tailwindcss(), analyzer({ enabled: isAnalyser })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      open: true,
      port: parseInt(env.VITE_PORT),
      proxy,
    },
  };
});
