// 실적 및 현황 > 전체 매출 현황 — revenue-agent/frontend 의 ComposedChartView 패턴을 이식.
// 시리즈별 type('bar' | 'line')에 따라 매출은 막대, 영업이익/세전이익/EBITDA는 선으로 렌더링하고,
// 차트 하단에 동일 데이터를 표로도 함께 보여준다.
import { Bar, ComposedChart, Line, ResponsiveContainer } from 'recharts';
import { Table } from '@/shared/components/commons';
import type { ChartSpec } from '@/features/dashboard/types';
import { CATEGORICAL_PALETTE } from './charts/chartPalette';
import {
  buildMetricColumns,
  renderCommonLegend,
  renderGrid,
  renderValueTooltip,
  renderXAxis,
  renderYAxis,
  toMetricRows,
  toRows,
} from './charts/chartCommonElements';
import styles from './RevenueOverviewChart.module.scss';

interface RevenueOverviewChartProps {
  spec: ChartSpec;
}

const RevenueOverviewChart = ({ spec }: RevenueOverviewChartProps) => {
  const rows = toRows(spec);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>전체 매출 현황</h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={rows}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderValueTooltip(spec.unit)}
          {renderCommonLegend()}
          {spec.series.map((series, i) => {
            const color = CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length];
            return series.type === 'bar' ? (
              <Bar key={series.name} dataKey={series.name} fill={color} radius={[3, 3, 0, 0]} maxBarSize={28} />
            ) : (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 2.5 }}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
      <Table rows={toMetricRows(spec)} columns={buildMetricColumns(spec)} className={styles.table} />
    </div>
  );
};

export default RevenueOverviewChart;
