// Jotai 상태 — 현재 선택된 에이전트 id (모든 서비스에서 공용)
import { atom } from 'jotai';
import type { AgentId } from '@/shared/types';

export const selectedAgentAtom = atom<AgentId>('analysis');
