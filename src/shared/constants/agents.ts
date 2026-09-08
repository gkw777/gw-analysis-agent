// LNB 에 노출되는 에이전트 목록.
// 새 에이전트를 추가하려면:
//   1. shared/types/agent.ts 의 AgentId 에 id 를 추가하고
//   2. 이 배열에 항목을 추가한다 (enabled: true)
import type { SvgIconComponent } from '@mui/icons-material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import type { AgentMeta } from '@/shared/types';

export interface AgentEntry extends AgentMeta {
  icon: SvgIconComponent;
}

export const AGENTS: AgentEntry[] = [
  {
    id: 'analysis',
    label: '성과분석',
    description: '이사진용 경영 데이터 분석',
    icon: QueryStatsIcon,
    enabled: true,
  },
];
