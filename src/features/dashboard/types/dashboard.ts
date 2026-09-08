// 재무제표 요약 표 — 지표(행) x 연도(2024/2025/2026, 열) 고정 구조.
// yoy 는 전년 대비 증감률(%, 부호 포함)로, 표에서 ▲/▼ 배지로 렌더링한다.
export interface FinancialSummaryRow {
  id: string;
  metric: string;
  y2024: number;
  y2024Yoy?: number;
  y2025: number;
  y2025Yoy?: number;
  y2026: number;
  y2026Yoy?: number;
}

// recharts 차트 하나를 그리는 데 필요한 최소 데이터 — revenue-agent/frontend 의 ChartSpec 을 이식.
export type ChartSeriesType = 'bar' | 'line' | 'area';

export interface ChartSeries {
  name: string;
  type: ChartSeriesType;
  values: number[];
}

export interface ChartSpec {
  xLabels: string[];
  series: ChartSeries[];
  unit?: string;
}

export interface DashboardInsight {
  id: string;
  title: string;
  body: string;
}

export interface DashboardData {
  financialSummary: FinancialSummaryRow[];
  /** 실적 및 현황 > 전체 매출 현황 — bar(매출) + line(영업이익/세전이익/EBITDA) 합성 차트 */
  revenueOverview: ChartSpec;
  /** 실적 및 현황 > 부문별 매출 — 방사형(radar) 차트 */
  segmentRevenue: ChartSpec;
  /** 실적 및 현황 > 부문별 영업이익 현황 — 영역(area) 차트 */
  segmentProfit: ChartSpec;
  /** 시장 데이터 — bar(방한 외래객수) + line(숙박 비중/RevPAR) 합성 차트 */
  marketData: ChartSpec;
  insights: DashboardInsight[];
}
