// 404 페이지 — 어떤 라우트에도 매칭되지 않는 경로에서 보여준다.
// 인증 상태에 맞는 기본 화면으로 돌아가는 버튼을 제공한다.
import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { authAtom } from '@/shared/store';
import { routePaths } from './paths';

const NotFoundPage = () => {
  const auth = useAtomValue(authAtom);
  const navigate = useNavigate();
  const homePath = auth ? routePaths.analysis : routePaths.login;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        textAlign: 'center',
        px: 3,
      }}
    >
      <Typography variant="h2" fontWeight={700} color="primary">
        404
      </Typography>
      <Typography variant="h6" fontWeight={600}>
        페이지를 찾을 수 없습니다
      </Typography>
      <Typography variant="body2" color="text.secondary">
        주소가 잘못 입력되었거나, 삭제되었거나, 이동된 페이지입니다.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<HomeOutlinedIcon />}
        sx={{ mt: 2 }}
        onClick={() => navigate(homePath, { replace: true })}
      >
        {auth ? '분석 화면으로 돌아가기' : '로그인 화면으로 이동'}
      </Button>
    </Box>
  );
};

export default NotFoundPage;
