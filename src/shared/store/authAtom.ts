// Jotai 전역 상태 — 인증 (auth/analysis 양쪽 feature 와 App 이 함께 사용)
import { atom } from 'jotai';
import { loadAuth } from '@/shared/utils/axiosInstance';
import type { Auth } from '@/shared/types';

// 인증: { token, name, role } | null — 로컬스토리지에서 복원 (새로고침해도 로그인 유지)
export const authAtom = atom<Auth | null>(loadAuth());
