// 앱 전역 window 이벤트 이름 모음 — shared 는 feature 상태를 알 수 없으므로,
// cross-cutting 신호(인증 만료/로그아웃/새 대화 시작)는 이벤트로 전달하고 각 feature 가 구독해 자신의 상태를 정리한다.

/** 응답 인터셉터가 401 을 감지했을 때 발행 */
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

/** 사용자가 직접 로그아웃했을 때 발행 */
export const LOGOUT_EVENT = 'auth:logout';

/** GNB "새 대화" 클릭 시 발행 — feature 가 구독해 채팅/보고서 세션 상태를 초기화한다 */
export const NEW_CONVERSATION_EVENT = 'app:new-conversation';
