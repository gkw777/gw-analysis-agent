// Jotai 상태 — 채팅
// splitView 전환 시 AnalysisPrompt 가 리마운트되므로(AnalysisPage.tsx 의 분기 구조가 다름),
// 메시지는 컴포넌트 로컬 상태가 아닌 atom 으로 관리해야 화면 전환 후에도 유지된다.
import { atom } from 'jotai';
import type { PromptMessage } from '@/features/analysis/types';

export const messagesAtom = atom<PromptMessage[]>([]);
