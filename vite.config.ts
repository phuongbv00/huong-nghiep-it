/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Đường dẫn tương đối + HashRouter: chạy được ở mọi thư mục (GitHub Pages, Netlify…).
  base: './',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
