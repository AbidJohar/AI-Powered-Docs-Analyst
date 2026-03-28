import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none",  // ← fixes popup.closed check
    },
  },

  plugins: [
    react(),
    tailwindcss()
  ],

})
