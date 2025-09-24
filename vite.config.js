import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/shreya-birthday/',   // 👈 important!
  plugins: [react()]
})

