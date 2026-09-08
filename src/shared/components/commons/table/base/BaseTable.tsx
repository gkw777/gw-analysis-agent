// MUI X DataGrid 최하위 wrapper — gba-cmmn-frontend 의 GbaBaseTable 을 이식.
// 프로젝트 표준 기본값(컬럼 메뉴/행 선택 비활성화)만 적용하고, 나머지 DataGridProps 는 그대로 전달한다.
// (columnGroupingModel 등 DataGrid 네이티브 기능도 rest 로 패스스루된다)
import { DataGrid, type DataGridProps, type GridValidRowModel } from '@mui/x-data-grid';
import type { ColumnsType } from '@/shared/components/commons/table/types';

export interface BaseTableProps<T extends GridValidRowModel> extends Omit<DataGridProps<T>, 'columns'> {
  className?: string;
  rows: T[];
  columns: ColumnsType<T>;
}

const BaseTable = <T extends GridValidRowModel>({ className, rows, columns, ...rest }: BaseTableProps<T>) => (
  <DataGrid
    className={className}
    rows={rows}
    columns={columns}
    disableColumnMenu
    disableRowSelectionOnClick
    hideFooter
    {...rest}
  />
);

export default BaseTable;
