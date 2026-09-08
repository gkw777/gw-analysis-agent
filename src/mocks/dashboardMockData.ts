import type { DashboardData } from '@/features/dashboard/types';

export const dashboardData: DashboardData = {
  financialSummary: [
    {
      id: 'revenue',
      metric: '연결매출(억원)',
      y2024: 25400,
      y2025: 26100,
      y2025Yoy: 2.7,
      y2026: 27800,
      y2026Yoy: 6.5,
    },
    {
      id: 'totalAssets',
      metric: '자산총계(억원)',
      y2024: 31200,
      y2025: 32500,
      y2025Yoy: 4.1,
      y2026: 33200,
      y2026Yoy: 2.1,
    },
  ],

  revenueOverview: {
    xLabels: ['2023년', '2024년', '2025년'],
    unit: '억원',
    series: [
      { name: '매출', type: 'bar', values: [1850, 2100, 2250] },
      { name: '영업이익', type: 'line', values: [130, 180, 210] },
      { name: '세전이익', type: 'line', values: [110, 150, 175] },
      { name: 'EBITDA', type: 'line', values: [240, 300, 330] },
    ],
  },

  segmentRevenue: {
    xLabels: ['객실', 'F&B', '대외사업', 'BQT', '임대/카지노'],
    unit: '억원',
    series: [
      { name: '2023년', type: 'line', values: [70, 60, 50, 40, 90] },
      { name: '2024년', type: 'line', values: [85, 75, 65, 55, 100] },
      { name: '2025년', type: 'line', values: [95, 90, 80, 60, 110] },
    ],
  },

  segmentProfit: {
    xLabels: ['2023년', '2024년', '2025년'],
    unit: '억원',
    series: [
      { name: '임대/카지노', type: 'area', values: [9, 12, 15] },
      { name: '대외사업', type: 'area', values: [2, 3, 5] },
      { name: 'BQT', type: 'area', values: [2, 4, 5] },
      { name: 'F&B', type: 'area', values: [5, 8, 11] },
      { name: '객실', type: 'area', values: [6, 10, 14] },
    ],
  },

  marketData: {
    xLabels: ['2023년', '2024년', '2025년'],
    series: [
      { name: '방한 외래객수(만명)', type: 'bar', values: [900, 1200, 1450] },
      { name: '외국인 숙박 비중(%)', type: 'line', values: [25.0, 35.2, 42.5] },
      { name: '서울 평균 RevPAR(만원)', type: 'line', values: [13.0, 15.5, 17.2] },
      { name: '워커힐 RevPAR(만원)', type: 'line', values: [12.5, 14.8, 16.5] },
    ],
  },

  insights: [
    {
      id: 'capital-review',
      title: '자본 배치 재검토 (Warning)',
      body: '재무제표 요약을 보면 자산총계 증감률이 5%로 하락하고 있습니다. 반면, 워커힐 자체의 3개년(23-25) 실적 트렌드는 매출과 EBITDA 모두 가파른 상승세를 보여 그룹 내 현금창출능력이 입증되었습니다.',
    },
    {
      id: 'fnb-profitability',
      title: 'F&B 부문 수익성 초과 달성',
      body: '워커힐 F&B 부문의 영업이익률이 2023년 6.9%에서 2025년 12.0%로 급성장하여 업계 평균(8.6%)을 압도하고 있습니다. 이는 프리미엄 전략이 적중된 결과로, 해당 부문의 컨셉 리뉴얼 및 카지노 VIP 연계 프로모션에 지주사 자본을 우선 배분할 가치가 충분합니다.',
    },
    {
      id: 'market-position',
      title: '시장 거래환경 우위 확보',
      body: '방한 외래객 수가 3년 새 1,450만명으로 급증함에 따라, 워커힐 RevPAR(16.5만) 역시 꾸준히 증가하며 서울 시내 5성급 평균(17.2만)과의 격차를 크게 좁혔습니다. 객실 리모델링(CAPEX 투입)이 수반된다면 26년에는 경쟁 우위를 점할 수 있을 것으로 전망됩니다.',
    },
  ],
};
