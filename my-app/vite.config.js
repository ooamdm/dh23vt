// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),     tailwindcss(),], // Kích hoạt plugin React cho Vite
  // Bạn có thể thêm các cấu hình khác ở đây nếu cần, ví dụ:
   server: {
     port: 5174, // Cổng phát triển
  },
  // build: {
  //   outDir: 'dist', // Thư mục đầu ra khi build
  // },
});
