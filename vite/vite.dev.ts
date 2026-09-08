import { UserConfig } from 'vite';
import { commonConfig } from './vite.common';

export const getDevConfig = (_env: Record<string, string>): UserConfig => {
  return {
    ...commonConfig,

    // 개발 서버 설정( 빌드시 무시됨 )
    server: {
      open: true,
      port: 3000,
      host: 'localhost',
      headers: {
        'Access-Control-Allow-Origin': '*', // 모든 도메인에서의 접근 허용
      },
      //   proxy: {
      //     '/api': {
      //       target: env.VITE_API_BASE_URL || 'http://localhost:8000', // FastAPI 백엔드
      //       changeOrigin: true,
      //       rewrite: (path) => path.replace(/^\/api/, ''), // '/api' 접두사 제거
      //     },
      //   },
    },
    // 빌드 설정
    build: {
      ...commonConfig.build,

      sourcemap: 'inline', // 개발 시 인라인 소스맵
      minify: false, // 개발 모드에서는 코드 압축하지 않음
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].[hash:8].js',
          chunkFileNames: 'js/chunk-[name].[hash:8].js',
          assetFileNames: 'assets/[name].[hash:8].[extname]',
        },
      },
    },
  };
};
