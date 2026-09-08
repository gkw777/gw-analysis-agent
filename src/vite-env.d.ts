/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API 서버 주소 — 미설정 시 '/api' (vite proxy 경유) */
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DEPLOY_ENV: 'local' | 'dev' | 'stg' | 'prod';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
