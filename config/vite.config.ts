import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://task.tspb.su',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/test-task')
      }
    }
  },

  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          leaflet: ['leaflet']
        }
      }
    }
  }
})