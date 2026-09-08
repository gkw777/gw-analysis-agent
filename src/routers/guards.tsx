// 라우트 인증 가드 — authAtom 상태에 따라 접근을 제어한다.
// data mode 레이아웃 라우트로 쓰이므로 통과 시 <Outlet /> 으로 자식 라우트를 렌더링한다.
import { Navigate, Outlet } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { authAtom } from '@/shared/store';
import { routePaths } from './paths';

/** 로그인 필요 라우트 — 미인증이면 로그인 화면으로 보낸다 */
export const RequireAuth = () => {
  const auth = useAtomValue(authAtom);
  return auth ? <Outlet /> : <Navigate to={routePaths.login} replace />;
};

/** 비로그인 전용 라우트(로그인 화면 등) — 이미 로그인했으면 기본 화면으로 보낸다 */
export const PublicOnly = () => {
  const auth = useAtomValue(authAtom);
  return auth ? <Navigate to={routePaths.analysis} replace /> : <Outlet />;
};

/** 루트('/') 접근 — 인증 상태에 맞는 기본 화면으로 보낸다 */
export const RootRedirect = () => {
  const auth = useAtomValue(authAtom);
  return <Navigate to={auth ? routePaths.analysis : routePaths.login} replace />;
};
