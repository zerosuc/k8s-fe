import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 主机地址，允许从外部访问
    port: 3000, // 端口号
    open: true, // 自动打开浏览器
    strictPort: true, // 如果端口已被占用，直接退出
    https: false, // 是否启用 HTTPS
    proxy: {
      // 配置代理
      '/api/v1/proxy': {
        target: 'http://localhost:8082/', // 代理到的地址
        changeOrigin: true // 是否改变源
        // rewrite: (path) => path.replace(/^\/api/v1/proxy//, '') // 重写路径
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
