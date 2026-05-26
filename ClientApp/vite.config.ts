import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Buradaki ({ mode }) kısmını sildik, dümdüz fonksiyon yaptık
export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  base: '/', 
  build: {
    outDir: path.resolve(__dirname, '../wwwroot/spa'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7150',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
