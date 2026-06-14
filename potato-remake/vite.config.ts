import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 구형 안드로이드 WebView 호환: 최신 문법 빌드는 오래된 WebView에서 빈 화면이 됨
    target: 'es2019',
  },
  server: {
    watch: {
      ignored: ['**/public/**']
    }
  }
})
// Restart trigger comment 2
