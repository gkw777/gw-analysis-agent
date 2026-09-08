// MUI FormLabel 을 감싸는 공용 wrapper — FormControl 안에서 입력 그룹의 라벨로 사용한다.
// 확장 포인트: 추후 권한·조건 로직이나 공통 스타일(필수 표시 등)을 이 파일에 추가하면 전 화면에 일괄 적용된다.
import { FormLabel as MuiFormLabel, type FormLabelProps as MuiFormLabelProps } from '@mui/material';

export interface FormLabelProps extends MuiFormLabelProps {
  // 추가 props 적용 가능. MUI FormLabelProps 를 상속받아 error, required, focused 등 기본 props 를 그대로 사용 가능.
}

const FormLabel = (props: FormLabelProps) => <MuiFormLabel {...props} />;

export default FormLabel;
