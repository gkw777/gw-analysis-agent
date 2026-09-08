// 인사이트 — 목데이터로 받은 텍스트를 번호 + 굵은 제목 + 본문 형태로 그대로 노출한다(차트/표 없음).
import type { DashboardInsight } from '@/features/dashboard/types';
import styles from './InsightSection.module.scss';

interface InsightSectionProps {
  insights: DashboardInsight[];
}

const InsightSection = ({ insights }: InsightSectionProps) => (
  <section className={styles.section}>
    <h2 className={styles.title}>인사이트</h2>
    <ol className={styles.list}>
      {insights.map((insight, i) => (
        <li key={insight.id} className={styles.item}>
          <span className={styles.itemTitle}>
            {i + 1}. {insight.title}:
          </span>{' '}
          <span className={styles.itemBody}>{insight.body}</span>
        </li>
      ))}
    </ol>
  </section>
);

export default InsightSection;
