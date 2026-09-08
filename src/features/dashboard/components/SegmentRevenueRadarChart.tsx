// 실적 및 현황 > 부문별 매출 — revenue-agent/frontend 의 RadarChartView 패턴을 이식.
// x_labels(부문 카테고리)를 극좌표 축으로, 연도별 series 를 겹쳐진 Radar 로 표시한다.
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import type { ChartSpec } from '@/features/dashboard/types';
import { CATEGORICAL_PALETTE } from './charts/chartPalette';
import { AXIS_STYLE, renderCommonLegend, renderValueTooltip, toRows } from './charts/chartCommonElements';
import styles from './SegmentRevenueRadarChart.module.scss';

interface SegmentRevenueRadarChartProps {
  spec: ChartSpec;
}

const SegmentRevenueRadarChart = ({ spec }: SegmentRevenueRadarChartProps) => {
  const rows = toRows(spec);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>부문별 매출</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={rows} outerRadius="75%">
          <PolarGrid stroke="#e9edf3" />
          <PolarAngleAxis dataKey="label" tick={AXIS_STYLE} />
          <PolarRadiusAxis tick={{ ...AXIS_STYLE, fontSize: 10 }} />
          {spec.series.map((series, i) => {
            const color = CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length];
            return (
              <Radar
                key={series.name}
                name={series.name}
                dataKey={series.name}
                stroke={color}
                fill={color}
                fillOpacity={0.35}
              />
            );
          })}
          {renderValueTooltip(spec.unit)}
          {renderCommonLegend()}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SegmentRevenueRadarChart;
