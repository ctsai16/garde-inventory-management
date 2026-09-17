import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Must match the GitHub repo name for Pages project sites: https://<user>.github.io/<repo>/
export default defineConfig({
  plugins: [react()],
  base: '/garde-inventory-management/',
})
