import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfill'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: "/ton-first-contract-frontend/",
});
