import type { ThresholdGroup } from '@/shared/types';

export const coreQuestions: string[] = [
  '워커힐은 그룹 내에서 계속 보유 투자...',
  '어느 자산, 시설에 추가 자본을 배분하...',
  '시장 성장과 내부 성장의 격차는 어디...',
  '카지노, 임대, 대외 사업은 자본 효율을...',
  '본사의 AI 데이터, 공유역량은 워커힐...',
  '재무 외 리스크가 장기 수익을 훼손하...',
];

export const keywords: string[] = [
  '#투하자본',
  '#자산가치',
  '#회수기간',
  '#공간시간 수익',
  '#계약수익',
  '#채택률',
  '#서비스',
  '#인력',
  '#평판',
  '#규제',
];

export const thresholdGroups: ThresholdGroup[] = [
  {
    label: '금액형(매출/이익)',
    options: ['-10%', '-5%', '+5%', '+10%'],
  },
  {
    label: '비율형(OCC/점유율)',
    options: ['-5%', '-3%', '+3%', '+5%'],
  },
  {
    label: '지수형(MPI/ARI/RGI)',
    options: ['95미만', '95~100'],
  },
];
