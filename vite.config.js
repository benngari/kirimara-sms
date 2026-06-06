import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: '/login.html',
    strictPort: false
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:  './index.html',
        login: './login.html',
      }
    }
  },
  preview: {
    port: 4000,
    open: '/login.html'
  }
})
