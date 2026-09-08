// MUI TextField 를 감싸는 공용 입력 wrapper — 프로젝트 표준 기본값(size, fullWidth)을 한곳에서 관리한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 readOnly)이나 공통 검증 표시를 이 파일에 추가하면 전 화면에 일괄 적용된다.
import { TextField, type TextFieldProps } from '@mui/material';

// TextFieldProps 는 variant 별 union 타입이라 interface extends 대신 type alias 로 그대로 사용한다.
export type InputProps = TextFieldProps & {
  // 추후 공통 검증 표시를 위해 errorMessage 를 추가할 수 있다. (MUI TextField 의 error, helperText 와 함께 사용)
  errorMessage?: string;
};

const Input = (props: InputProps) => {
  const { errorMessage, ...rest } = props;

  return <TextField size="small" fullWidth error={!!errorMessage} helperText={errorMessage} {...rest} />;
};

export default Input;
