import { UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export const commonConfig: UserConfig = {
  // 플러그인 설정
  plugins: [react(), svgr()],
  // resolve 설정
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  // 빌드 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
};
