import { Suspense, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { CircularProgress, Box } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { authAtom } from '@/shared/store';
import { UNAUTHORIZED_EVENT } from '@/shared/utils';
import { router } from '@/routers';
import { useGlobalRejectionAlert } from '@/shared/hooks';

const RouteFallback = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
};

const App = () => {
  const setAuth = useSetAtom(authAtom);

  // catch 되지 않은 axios 에러를 감지해 전역 Alert 모달로 알린다.
  // 401 은 로그인 화면 리다이렉트로 이미 처리하므로 제외.
  useGlobalRejectionAlert();

  // 응답 인터셉터가 401 을 감지하면(토큰 만료 등) 인증을 비워 로그인 화면으로 되돌린다
  useEffect(() => {
    const handler = () => setAuth(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  }, [setAuth]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
