import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    // FIX: code splitting — pecah 950KB bundle jadi chunk kecil
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom'],
          // Chart library (berat)
          'vendor-charts': ['recharts'],
          // Scanner library
          'vendor-scanner': ['html5-qrcode'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
