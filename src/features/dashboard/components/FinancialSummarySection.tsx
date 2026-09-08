// 재무제표 요약 — shared Table(MUI X DataGrid 포팅) 사용.
// 참고: 전년 대비 증감률(YoY) 3% 내외 시 경고로 본다는 안내 문구를 표 상단에 함께 노출한다.
import { Table, type ColumnsType } from '@/shared/components/commons';
import type { FinancialSummaryRow } from '@/features/dashboard/types';
import styles from './FinancialSummarySection.module.scss';

interface FinancialSummarySectionProps {
  rows: FinancialSummaryRow[];
}

const formatValue = (value: number) => value.toLocaleString();

const renderYoyCell = (value: number, yoy?: number) => (
  <span className={styles.valueCell}>
    {formatValue(value)}
    {yoy !== undefined && (
      <span className={yoy >= 0 ? styles.yoyUp : styles.yoyDown}>
        {yoy >= 0 ? '▲' : '▼'} {Math.abs(yoy).toFixed(1)}%
      </span>
    )}
  </span>
);

const columns: ColumnsType<FinancialSummaryRow> = [
  { field: 'metric', headerName: '구분', flex: 1, minWidth: 160 },
  {
    field: 'y2024',
    headerName: '2024년 (실적)',
    flex: 1,
    minWidth: 160,
    render: (value) => formatValue(value as number),
  },
  {
    field: 'y2025',
    headerName: '2025년 (실적)',
    flex: 1,
    minWidth: 160,
    render: (value, row) => renderYoyCell(value as number, row.y2025Yoy),
  },
  {
    field: 'y2026',
    headerName: '2026년 (계획)',
    flex: 1,
    minWidth: 160,
    render: (value, row) => renderYoyCell(value as number, row.y2026Yoy),
  },
];

const FinancialSummarySection = ({ rows }: FinancialSummarySectionProps) => (
  <section className={styles.section}>
    <div className={styles.header}>
      <h2>재무제표 요약</h2>
      <span className={styles.notice}>※ 전년 대비 증감률(YoY) 3% 내외 시 경고</span>
    </div>
    <Table rows={rows} columns={columns} />
  </section>
);

export default FinancialSummarySection;
