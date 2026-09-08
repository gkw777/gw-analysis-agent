// gba-cmmn-frontend 의 GbaColumnsType 패턴을 이식 — MUI X DataGrid 의 GridColDef 에
// 셀 커스터마이징(값 포맷/링크/날짜)을 위한 필드만 얹는다.
import type { ReactNode } from 'react';
import type { GridCellParams, GridColDef, GridRenderCellParams, GridValidRowModel } from '@mui/x-data-grid';

export type ColumnType<T extends GridValidRowModel> = GridColDef<T> & {
  /** 링크처리 여부 */
  isLink?: boolean;
  /** 항목 숨김 여부 */
  isHide?: boolean;
  /** 날짜 포맷 지정. YYYY/MM/DD, YYYY-MM-DD 등 */
  dateFormat?: string;
  /** 셀 렌더링 커스터마이징. renderCell 과 달리 row 전체를 받아 처리 가능 */
  render?: (value: GridCellParams<T, unknown>['value'], record: T, params: GridRenderCellParams<T>) => ReactNode;
  /** 셀 클릭 이벤트. isLink=true 인 경우에만 유효 */
  onCellClick?: (record: T) => void;
};

export type ColumnsType<T extends GridValidRowModel = GridValidRowModel> = ColumnType<T>[];
