import axios from 'axios';

/** axios 에러에서 백엔드가 보낸 detail 메시지를 꺼낸다 (FastAPI HTTPException 기본 형태). */
export const errorMessage = (err: unknown, fallback = '요청 실패'): string => {
  if (axios.isAxiosError(err)) return err.response?.data?.detail ?? err.message;
  if (err instanceof Error) return err.message;
  return fallback;
};
