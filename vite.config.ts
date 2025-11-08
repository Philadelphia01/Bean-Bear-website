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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate Firebase into its own chunk
          if (id.includes('firebase')) {
            return 'firebase';
          }
          // Separate vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable minification (esbuild is faster and doesn't require additional dependencies)
    minify: 'esbuild',
    // Enable source maps for debugging (optional, can disable for smaller builds)
    sourcemap: false,
  },
});
