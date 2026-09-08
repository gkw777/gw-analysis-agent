// MUI Button 을 감싸는 공용 wrapper — 프로젝트 표준 기본값(variant, disableElevation)을 한곳에서 관리한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 disabled/숨김)을 이 파일에 추가하면 사용하는 모든 화면에 일괄 적용된다.
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  // 추가 props 적용 가능. MUI ButtonProps 를 상속받아 variant, size, color, startIcon 등 기본 props 를 그대로 사용 가능.
}

const Button = ({ variant = 'contained', disableElevation = true, ...props }: ButtonProps) => (
  <MuiButton variant={variant} disableElevation={disableElevation} disableRipple {...props} />
);

export default Button;
