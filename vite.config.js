import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/", // important for Netlify routes
  build: {
    outDir: "dist", // Netlify will deploy from dist
  },
})
