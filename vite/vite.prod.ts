import { UserConfig } from 'vite';
import { commonConfig } from './vite.common';

export const getProdConfig = (env: Record<string, string>): UserConfig => {
  return {
    ...commonConfig,

    build: {
      ...commonConfig.build,

      sourcemap: false, // 프로덕션에서는 소스맵을 생성하지 않음
      minify: 'terser', // 코드 압축을 위해 terser 사용
      cssMinify: true, // CSS 압축 활성화
      cssCodeSplit: true, // CSS 코드 분할 활성화

      terserOptions: {
        mangle: true, // 변수명 압축
        format: {
          comments: false, // 주석 제거
        },
        keep_classnames: false, // 클래스명 압축
        keep_fnames: false, // 함수명 압축
        compress: {
          drop_console: env.VITE_DEPLOY_ENV === 'prod', // 콘솔 로그 제거
          drop_debugger: true, // 디버거 제거
        },
      },

      rollupOptions: {
        output: {
          entryFileNames: 'js/[name].[hash:8].js', // 엔트리 파일명에 해시 추가
          chunkFileNames: 'js/chunk-[name].[hash:8].js', // 청크 파일명에 해시 추가
          assetFileNames: 'assets/[name].[hash:8].[extname]', // 자산 파일명에 해시 추가
        },
      },
    },
  };
};
