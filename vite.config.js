import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = {
  '/edugame_api': {
    target: 'http://127.0.0.1',
    changeOrigin: true,
    secure: false
  }
}

// https://vite.dev
export default defineConfig({
  base: '/EduGame/',
  server: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
    allowedHosts: ['wielder-retract-frenzy.ngrok-free.dev'],
    proxy: apiProxy
  },
  preview: {
    host: '0.0.0.0',
    port: 4174,
    strictPort: true,
    proxy: apiProxy
  },
  plugins: [react()]
})
