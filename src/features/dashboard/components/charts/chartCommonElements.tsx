// revenue-agent/frontend 의 공유 recharts element factory 패턴을 이식.
// 반드시 "함수가 엘리먼트를 반환"하는 형태를 유지한다 — recharts 는 각 차트의 직계 children 의
// type 을 검사해 축/그리드/범례 레이아웃을 계산하므로, 이 함수들을 별도 컴포넌트로 감싸면
// (예: const Grid = () => renderGrid()) 레이아웃이 조용히 깨진다.
import { CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import type { ChartSpec } from '@/features/dashboard/types';
import type { ColumnsType } from '@/shared/components/commons';

export const AXIS_STYLE = { fontSize: 12, fill: '#6b7280' };
export const LEGEND_STYLE = { fontSize: 13 };

/** ChartSpec(x_labels + series) → recharts 가 요구하는 행 배열([{ label, [seriesName]: value }]) */
export const toRows = (spec: ChartSpec): Array<Record<string, string | number>> =>
  spec.xLabels.map((label, i) => {
    const row: Record<string, string | number> = { label };
    spec.series.forEach((s) => {
      row[s.name] = s.values[i];
    });
    return row;
  });

export const renderGrid = () => <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#e9edf3" vertical={false} />;

export const renderXAxis = () => <XAxis key="xAxis" dataKey="label" tick={AXIS_STYLE} tickMargin={6} />;

export const renderYAxis = (width = 56) => <YAxis key="yAxis" tick={AXIS_STYLE} width={width} />;

export const renderValueTooltip = (unit?: string) => (
  <Tooltip
    key="tooltip"
    formatter={(value: number) => [unit ? `${value.toLocaleString()} ${unit}` : value.toLocaleString(), '']}
  />
);

export const renderCommonLegend = () => <Legend key="legend" wrapperStyle={LEGEND_STYLE} />;

/** 차트 하단/옆에 붙는 데이터 표 한 행 — 시리즈(부문/지표) 하나가 행이 되고, x_labels(연도 등)가 동적 컬럼이 된다 */
export interface MetricRow {
  [xLabel: string]: number | string;
  id: string;
  metric: string;
}

/** ChartSpec → MetricRow[] (toRows 와 반대 방향의 전치) */
export const toMetricRows = (spec: ChartSpec): MetricRow[] =>
  spec.series.map((s) => {
    const row: MetricRow = { id: s.name, metric: s.name };
    spec.xLabels.forEach((label, i) => {
      row[label] = s.values[i];
    });
    return row;
  });

export const buildMetricColumns = (spec: ChartSpec): ColumnsType<MetricRow> => [
  { field: 'metric', headerName: '구분', flex: 1, minWidth: 140 },
  ...spec.xLabels.map((label) => ({ field: label, headerName: label, flex: 1, minWidth: 100 })),
];
