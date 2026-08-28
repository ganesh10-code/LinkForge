import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // allow external access (inside Docker)
    port: 5173,        // make sure this matches EXPOSE in Dockerfile
    strictPort: true,  // fail if port is taken, instead of picking a random one
    watch: {
      usePolling: true // needed for hot reload in Docker sometimes
    },
    allowedHosts: ['.localhost', 'url-shortener-beige-phi.vercel.app', 'urlshortener-frontend-x13q.onrender.com','shortifyreac.netlify.app/'] 
  }
})
