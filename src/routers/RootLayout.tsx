// 라우터 최상위 레이아웃 — 인증 전/후 화면 전체를 감싸, GlobalAlertModal 이 라우터 트리 안에서
// (useNavigate 사용 가능) 어떤 화면에서든 마운트되어 있도록 한다.
import { Outlet } from 'react-router-dom';
import { GlobalAlertModal } from '@/shared/components/specific';

const RootLayout = () => (
  <>
    <Outlet />
    <GlobalAlertModal />
  </>
);

export default RootLayout;
