import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // غیرفعال کردن source maps برای تولید
  },
  server: {
    sourcemap: false, // غیرفعال کردن source maps برای dev
  },
});