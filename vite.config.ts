import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('jspdf')) return 'jspdf';
          if (id.includes('pdfjs-dist')) return 'pdfjs';
        }
      }
    }
  }
})
