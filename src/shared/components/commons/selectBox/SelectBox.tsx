// MUI Select 를 감싸는 공용 셀렉트박스 wrapper — options 배열만 넘기면 MenuItem 목록을 렌더링한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 선택 제한)을 이 파일에 추가하면 전 화면에 일괄 적용된다.
import type { ReactNode } from 'react';
import { MenuItem, Select, type SelectProps } from '@mui/material';

export interface SelectOption {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface SelectBoxProps extends Omit<SelectProps, 'children'> {
  /** 렌더링할 선택지 목록 */
  options: SelectOption[];
}

const SelectBox = ({ options, size = 'small', ...props }: SelectBoxProps) => (
  <Select size={size} {...props}>
    {options.map((option) => (
      <MenuItem key={String(option.value)} value={option.value} disabled={option.disabled}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
);

export default SelectBox;
