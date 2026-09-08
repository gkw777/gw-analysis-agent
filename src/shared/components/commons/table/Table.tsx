// MUI X DataGrid 를 감싸는 공용 표 컴포넌트 — gba-cmmn-frontend 의 GbaTableData 를 이식.
// Paper 카드로 감싸고, 컬럼의 render/dateFormat/isLink 를 실제 renderCell 로 변환한다.
// react-bootstrap 기반 커스텀 툴바/페이지네이션은 이식하지 않는다 — 이 프로젝트 대시보드 표는
// 소규모 고정 데이터라 DataGrid 내장 pagination 만으로 충분하다.
import type { ReactNode } from 'react';
import { Paper } from '@mui/material';
import type { GridColDef, GridRenderCellParams, GridValidRowModel } from '@mui/x-data-grid';
import BaseTable, { type BaseTableProps } from './base/BaseTable';
import type { ColumnsType } from './types';
import styles from './Table.module.scss';

export interface TableProps<T extends GridValidRowModel> extends Omit<BaseTableProps<T>, 'columns'> {
  columns: ColumnsType<T>;
  /** true 면 맨 앞에 1부터 시작하는 행 번호 컬럼을 자동으로 붙인다 */
  isNo?: boolean;
  className?: string;
}

const formatDate = (value: unknown, dateFormat: string): string => {
  if (value === null || value === undefined || value === '') return '';
  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) return String(value);
  return dateFormat
    .replace('YYYY', String(date.getFullYear()))
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('DD', String(date.getDate()).padStart(2, '0'));
};

const toGridColumns = <T extends GridValidRowModel>(columns: ColumnsType<T>): GridColDef<T>[] =>
  columns
    .filter((column) => !column.isHide)
    .map(({ isLink, isHide: _isHide, dateFormat, render, onCellClick, ...column }) => {
      if (!render && !dateFormat && !isLink) return column as GridColDef<T>;

      const renderCell = (params: GridRenderCellParams<T>): ReactNode => {
        if (render) return render(params.value, params.row, params);
        if (dateFormat) return formatDate(params.value, dateFormat);
        return String(params.value ?? '');
      };

      return {
        ...column,
        renderCell: (params: GridRenderCellParams<T>) => {
          const content = renderCell(params);
          if (!isLink) return content;
          return (
            <span
              className={styles.linkCell}
              onClick={onCellClick ? () => onCellClick(params.row) : undefined}
              role={onCellClick ? 'button' : undefined}
              tabIndex={onCellClick ? 0 : undefined}
            >
              {content}
            </span>
          );
        },
      } as GridColDef<T>;
    });

const NO_COLUMN: GridColDef<GridValidRowModel> = {
  field: '__no',
  headerName: 'No',
  width: 64,
  sortable: false,
  filterable: false,
  renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
};

const Table = <T extends GridValidRowModel>({ columns, isNo = false, className, ...rest }: TableProps<T>) => {
  const gridColumns = toGridColumns(columns);
  const allColumns = isNo ? [NO_COLUMN as GridColDef<T>, ...gridColumns] : gridColumns;

  return (
    <Paper variant="outlined" className={className}>
      <BaseTable columns={allColumns as ColumnsType<T>} {...rest} />
    </Paper>
  );
};

export default Table;
