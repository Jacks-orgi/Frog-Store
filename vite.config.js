import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/Frog-Store",
  server: {
    historyApiFallback: true
  }
})
