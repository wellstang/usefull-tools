import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/usefull-tools/',
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('sql-formatter')) return 'sql-formatter'
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes('/views/tools/dev/')) return 'tools-dev'
          if (id.includes('/views/tools/product/')) return 'tools-product'
          if (id.includes('/views/tools/ops/')) return 'tools-ops'
          if (id.includes('/views/tools/design/')) return 'tools-design'
          if (id.includes('/views/tools/life/')) return 'tools-life'
        }
      }
    }
  }
})
