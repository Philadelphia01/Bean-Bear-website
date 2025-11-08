import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    // Enable minification (esbuild is faster and doesn't require additional dependencies)
    minify: 'esbuild',
    // Enable source maps for debugging (optional, can disable for smaller builds)
    sourcemap: false,
  },
});
