// MUI Checkbox 를 감싸는 공용 wrapper — label 을 넘기면 FormControlLabel 로 감싸 라벨과 함께 렌더링한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 disabled)을 이 파일에 추가하면 전 화면에 일괄 적용된다.
import type { ReactNode } from 'react';
import { Checkbox as MuiCheckbox, FormControlLabel, type CheckboxProps as MuiCheckboxProps } from '@mui/material';

export interface CheckboxProps extends MuiCheckboxProps {
  /** 지정하면 FormControlLabel 로 감싸 라벨과 함께 렌더링한다 */
  label?: ReactNode;
}

const Checkbox = ({ label, size = 'small', disabled, ...props }: CheckboxProps) => {
  const control = <MuiCheckbox size={size} disabled={disabled} {...props} />;
  if (label === undefined) return control;
  return <FormControlLabel control={control} label={label} disabled={disabled} />;
};

export default Checkbox;
