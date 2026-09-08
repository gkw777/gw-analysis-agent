// 공용 앱 Shell — 인증된 모든 서비스가 공용하는 LNB(새 대화/핵심질문/키워드/임계설정/프로필) 를 제공한다.
// 타이틀바는 대화 시작 전 첫 화면엔 노출하지 않고, 분할뷰로 전환된 뒤에만 보여야 하므로
// (그 시점을 아는 건 각 feature 뿐이라) 여기서 고정 제공하지 않고 각 페이지가 필요할 때 직접 렌더링한다.
// 콘텐츠는 <Outlet/> 으로 라우터 자식 라우트가 여기 꽂힌다.
import { Outlet } from 'react-router-dom';
import { AppLayout, Lnb } from '@/shared/components/layouts';

const AppShell = () => {
  return (
    <AppLayout sidebar={<Lnb />}>
      <Outlet />
    </AppLayout>
  );
};

export default AppShell;
