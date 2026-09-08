// 아이콘 + 접근성 라벨 + (선택) 툴팁을 표준화한 순수 버튼 wrapper.
// className/tooltipWrapClassName 을 그대로 전달받아 시각은 호출부가 계속 소유한다.
import type { MouseEvent, ReactElement } from 'react';
import { Tooltip, type TooltipProps } from '@mui/material';

interface IconRailButtonProps {
  icon: ReactElement;
  ariaLabel: string;
  tooltip?: string;
  tooltipPlacement?: TooltipProps['placement'];
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  tooltipWrapClassName?: string;
}

const IconRailButton = ({
  icon,
  ariaLabel,
  tooltip,
  tooltipPlacement = 'right',
  onClick,
  className,
  tooltipWrapClassName,
}: IconRailButtonProps) => {
  const button = (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {icon}
    </button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip title={tooltip} placement={tooltipPlacement} arrow>
      <span className={tooltipWrapClassName}>{button}</span>
    </Tooltip>
  );
};

export default IconRailButton;
