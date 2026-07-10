import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple Vite config — just the React plugin, nothing else.
// We use .js files (no JSX), so we don't need any special plugins.
export default defineConfig({
  plugins: [react()],
})
