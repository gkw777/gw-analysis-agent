// MUI RadioGroup 을 감싸는 공용 라디오버튼 wrapper — options 배열만 넘기면 Radio 목록을 렌더링한다.
// 확장 포인트: 추후 권한·조건 로직(예: role 별 선택 제한)을 이 파일에 추가하면 전 화면에 일괄 적용된다.
import type { ReactNode } from 'react';
import {
  FormControlLabel,
  Radio,
  RadioGroup as MuiRadioGroup,
  type RadioGroupProps as MuiRadioGroupProps,
  type RadioProps,
} from '@mui/material';

export interface RadioOption {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps extends MuiRadioGroupProps {
  /** 렌더링할 선택지 목록 */
  options: RadioOption[];
  /** 개별 Radio 에 공통 적용할 props (size, color 등) */
  radioProps?: RadioProps;
}

const RadioGroup = ({ options, radioProps, ...props }: RadioGroupProps) => (
  <MuiRadioGroup {...props}>
    {options.map((option) => (
      <FormControlLabel
        key={String(option.value)}
        value={option.value}
        label={option.label}
        disabled={option.disabled}
        control={<Radio size="small" {...radioProps} />}
      />
    ))}
  </MuiRadioGroup>
);

export default RadioGroup;
