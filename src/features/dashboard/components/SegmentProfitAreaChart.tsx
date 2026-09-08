// 실적 및 현황 > 부문별 영업이익 현황 — revenue-agent/frontend 의 AreaChartView 패턴을 이식.
// 참고 프로젝트는 overlay 방식(stackId 없음)이지만, 부문별 합산이 총 영업이익이 되도록
// 이 화면에서는 각 Area 에 stackId="1" 을 부여해 누적(stacked) 영역 차트로 변형한다.
// 3열 그리드의 좁은 칼럼 폭에서는 차트+표를 옆으로 나란히 두면 각자 자리가 부족해지므로,
// 다른 실적 카드(전체 매출 현황/시장 데이터)와 동일하게 차트 아래에 표를 배치한다.
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
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
import styles from './SegmentProfitAreaChart.module.scss';

interface SegmentProfitAreaChartProps {
  spec: ChartSpec;
}

const SegmentProfitAreaChart = ({ spec }: SegmentProfitAreaChartProps) => {
  const rows = toRows(spec);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>부문별 영업이익 현황</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={rows}>
          {renderGrid()}
          {renderXAxis()}
          {renderYAxis()}
          {renderValueTooltip(spec.unit)}
          {renderCommonLegend()}
          {spec.series.map((series, i) => {
            const color = CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length];
            return (
              <Area
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stackId="1"
                stroke={color}
                fill={color}
                fillOpacity={0.6}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
      <Table rows={toMetricRows(spec)} columns={buildMetricColumns(spec)} className={styles.table} />
    </div>
  );
};

export default SegmentProfitAreaChart;
