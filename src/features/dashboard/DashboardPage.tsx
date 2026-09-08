// 대시보드 화면 콘텐츠 — 좌측 GNB 는 shared/components/layouts/appShell 에서 제공하므로,
// 여기는 재무제표 요약/실적 및 현황/시장 데이터/인사이트 콘텐츠만 렌더링한다.
import { Spinner } from '@/shared/components/commons';
import { TitleBar } from '@/shared/components/layouts';
import { useDashboardData } from '@/features/dashboard/hooks';
import FinancialSummarySection from '@/features/dashboard/components/FinancialSummarySection';
import RevenueOverviewChart from '@/features/dashboard/components/RevenueOverviewChart';
import SegmentRevenueRadarChart from '@/features/dashboard/components/SegmentRevenueRadarChart';
import SegmentProfitAreaChart from '@/features/dashboard/components/SegmentProfitAreaChart';
import MarketDataSection from '@/features/dashboard/components/MarketDataSection';
import InsightSection from '@/features/dashboard/components/InsightSection';
import styles from './DashboardPage.module.scss';

const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

const DashboardPage = () => {
  const data = useDashboardData();

  return (
    <div className={styles.page}>
      <TitleBar title="성과분석" actions={<span className={styles.date}>{today}</span>} />

      {!data ? (
        <Spinner center />
      ) : (
        <div className={styles.body}>
          <FinancialSummarySection rows={data.financialSummary} />

          <div className={styles.performanceGrid}>
            <RevenueOverviewChart spec={data.revenueOverview} />
            <SegmentRevenueRadarChart spec={data.segmentRevenue} />
            <SegmentProfitAreaChart spec={data.segmentProfit} />
          </div>

          <div className={styles.bottomGrid}>
            <MarketDataSection spec={data.marketData} />
            <InsightSection insights={data.insights} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
