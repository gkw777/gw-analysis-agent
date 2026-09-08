// MUI CircularProgress 를 감싸는 공용 로딩 wrapper — center 를 켜면 부모 영역 중앙에 배치된다.
// 확장 포인트: 로딩 표현을 바꾸고 싶을 때(스켈레톤, 브랜드 스피너 등) 이 파일만 수정하면 전 화면에 일괄 적용된다.
import { Box, CircularProgress, type CircularProgressProps } from '@mui/material';

export interface SpinnerProps extends CircularProgressProps {
  /** true 면 부모 영역(width/height 100%) 중앙에 배치한다 */
  center?: boolean;
}

const Spinner = ({ center = false, size = 32, ...props }: SpinnerProps) => {
  const progress = <CircularProgress size={size} {...props} />;
  if (!center) return progress;
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {progress}
    </Box>
  );
};

export default Spinner;
