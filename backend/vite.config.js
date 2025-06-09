import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

// vite.config.js
export default defineConfig({
  server: {
    host: 'localhost',
    port: 5174,
    strictPort: true,
  }
});
