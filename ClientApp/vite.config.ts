import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// DİKKAT: 'path' import satırını tamamen kaldırdık!

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  base: '/spa/', 
  build: {
    outDir: '../wwwroot/spa', 
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
