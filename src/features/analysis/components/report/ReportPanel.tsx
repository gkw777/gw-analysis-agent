// 보고서 패널 — 뼈대 단계 플레이스홀더. 실제 차트/보고서 렌더링은 report/charts 하위에 이후 구현한다.
import { Box, Stack, Typography } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ReportPanel = () => (
  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Stack spacing={1.5} alignItems="center" sx={{ textAlign: 'center' }}>
      <AssessmentIcon color="primary" sx={{ fontSize: 40 }} />
      <Typography variant="subtitle1" fontWeight={700}>
        분석 보고서 준비 중
      </Typography>
      <Typography variant="body2" color="text.secondary">
        질문에 대한 분석 결과가 여기에 표시됩니다.
      </Typography>
    </Stack>
  </Box>
);

export default ReportPanel;
