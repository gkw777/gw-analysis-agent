// MUI FormControl 을 감싸는 공용 wrapper — 입력 계열 컴포넌트(SelectBox, Input 등)를 묶어 label/helper/error 상태를 공유한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 전체 disabled)을 이 파일에 추가하면 전 화면에 일괄 적용된다.
import { FormControl as MuiFormControl, type FormControlProps as MuiFormControlProps } from '@mui/material';

export interface FormControlProps extends MuiFormControlProps {
  // 추가 props 적용 가능. MUI FormControlProps 를 상속받아 error, required, disabled 등 기본 props 를 그대로 사용 가능.
}

const FormControl = ({ size = 'small', fullWidth = true, ...props }: FormControlProps) => (
  <MuiFormControl size={size} fullWidth={fullWidth} {...props} />
);

export default FormControl;
