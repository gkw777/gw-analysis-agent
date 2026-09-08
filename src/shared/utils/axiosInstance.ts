// axios 인스턴스 — 요청/응답 인터셉터와 인증 토큰 저장(로컬스토리지)을 한곳에서 관리한다.
//
// - baseURL: VITE_API_BASE_URL 환경변수 우선, 미설정 시 '/api' (개발용 vite proxy 경유)
// - 요청 인터셉터: 로컬스토리지의 토큰을 Authorization: Bearer 헤더로 주입
// - 응답 인터셉터: 401(토큰 만료/무효) 수신 시 저장된 인증을 지우고 전역 이벤트를 발행해
//   App 이 로그인 화면으로 되돌리게 한다. 그 외 에러는 그대로 reject — errorMessage.ts 로 처리.
import axios, { type AxiosRequestConfig } from 'axios';
import type { Auth } from '@/shared/types';
import { HttpStatus } from '@/shared/constants';
import env from './env';
import { UNAUTHORIZED_EVENT } from './appEvents';

const AUTH_STORAGE_KEY = 'analysis-agent.auth';

/** 로컬스토리지에서 인증 정보({ token, name, role })를 복원한다. 없거나 깨졌으면 null. */
export const loadAuth = (): Auth | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Auth;
    return parsed.token ? parsed : null;
  } catch {
    return null;
  }
};

/** 인증 정보를 로컬스토리지에 저장한다. null 이면 삭제(로그아웃). */
export const saveAuth = (auth: Auth | null): void => {
  if (auth) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  else localStorage.removeItem(AUTH_STORAGE_KEY);
};

const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl || '/api',
});

// 요청 인터셉터 — 매 요청 시점의 최신 토큰을 로컬스토리지에서 읽어 주입
axiosInstance.interceptors.request.use((config) => {
  const auth = loadAuth();
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

// 응답 인터셉터 — 401 이면 세션 정리 후 전역 로그아웃 유도, 나머지는 호출부로 전파
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === HttpStatus.Unauthorized) {
      saveAuth(null);
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;

export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  axiosInstance.get<T>(url, config).then((res) => res.data);

export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  axiosInstance.post<T>(url, data, config).then((res) => res.data);

export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
  axiosInstance.put<T>(url, data, config).then((res) => res.data);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  axiosInstance.delete<T>(url, config).then((res) => res.data);
