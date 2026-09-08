// 대화 세션을 첫 화면 상태로 되돌려야 하는 신호들을 구독한다.
//  - NEW_CONVERSATION_EVENT: LNB "새 채팅" 클릭
//  - LOGOUT_EVENT / UNAUTHORIZED_EVENT: 로그아웃 · 토큰 만료로 세션 종료
// shared(LNB·axios 인터셉터) 는 feature 상태를 알 수 없어 window 이벤트로 신호만 보내므로
// (appEvents.ts 참고), 실제 상태 초기화는 feature 쪽 책임이다.
// 세션 종료도 함께 구독하는 이유: messagesAtom 은 모듈 레벨이라 화면 언마운트로는 비워지지 않아,
// 다른 계정으로 다시 로그인하면 이전 사용자의 대화가 그대로 남는다.
// splitView 를 false 로 되돌리면 AnalysisPage 의 분기가 바뀌며 AnalysisPrompt 가 리마운트되어
// 입력창 텍스트·스크롤 위치 같은 로컬 상태도 함께 초기화된다.
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { NEW_CONVERSATION_EVENT, LOGOUT_EVENT, UNAUTHORIZED_EVENT } from '@/shared/utils';
import { messagesAtom, splitViewAtom } from '@/features/analysis/store';

const RESET_EVENTS = [NEW_CONVERSATION_EVENT, LOGOUT_EVENT, UNAUTHORIZED_EVENT];

const useConversationReset = () => {
  const setMessages = useSetAtom(messagesAtom);
  const setSplitView = useSetAtom(splitViewAtom);

  useEffect(() => {
    const handler = () => {
      setMessages([]);
      setSplitView(false);
    };
    RESET_EVENTS.forEach((name) => window.addEventListener(name, handler));
    return () => RESET_EVENTS.forEach((name) => window.removeEventListener(name, handler));
  }, [setMessages, setSplitView]);
};

export default useConversationReset;
