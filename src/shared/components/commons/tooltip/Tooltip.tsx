// MUI Tooltip 을 감싸는 공용 wrapper — 프로젝트 표준 기본값(arrow, placement)을 한곳에서 관리한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 문구 변경)을 이 파일에 추가하면 전 화면에 일괄 적용된다.
import { Tooltip as MuiTooltip, type TooltipProps as MuiTooltipProps } from '@mui/material';

export interface TooltipProps extends MuiTooltipProps {
  // 추가 props 적용 가능. MUI TooltipProps 를 상속받아 title, placement, arrow 등 기본 props 를 그대로 사용 가능.
}

const Tooltip = ({ arrow = true, placement = 'top', ...props }: TooltipProps) => (
  <MuiTooltip arrow={arrow} placement={placement} {...props} />
);

export default Tooltip;
