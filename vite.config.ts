import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      // Proxy /api-chat to backend to circumvent browser CORS restrictions if needed
      '/api-chat': {
        target: 'https://gitagptapi.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-chat/, '/chat'),
      },
      '/auth': {
        target: 'https://gitagptapi.vercel.app',
        changeOrigin: true,
      },
      '/sessions': {
        target: 'https://gitagptapi.vercel.app',
        changeOrigin: true,
      },
    },

  },
})
