// 에이전트 도메인 타입 — 추후 백엔드 스키마와 대응시킨다.

/** GNB 에이전트 id — 새 에이전트를 추가할 때 여기와 constants/agents.ts 목록을 함께 늘린다. */
export type AgentId = 'analysis';

export interface AgentMeta {
  id: AgentId;
  label: string;
  description: string;
  /** false 면 GNB 에 "준비 중"으로 표시되고 선택할 수 없다 */
  enabled: boolean;
}
