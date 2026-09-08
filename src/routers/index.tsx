// 앱 라우터 — data mode(createBrowserRouter) 로 각 feature 라우터를 조립한다.
// shared/components/layouts/appShell 은 RequireAuth 로 감싸진 인증된 routes 의 부모 레이아웃으로 제공.
// 새 feature 를 추가할 때는 <name>Router.tsx 를 만들고 analysisRouter 옆에 합친다.
import { createBrowserRouter } from 'react-router-dom';
import { authRouter } from './authRouter';
import { analysisRouter } from './analysisRouter';
import { dashboardRouter } from './dashboardRouter';
import { RequireAuth, RootRedirect } from './guards';
import NotFoundPage from './NotFoundPage';
import RootLayout from './RootLayout';
import { AppShell } from '@/shared/components/layouts';
import { exampleRouter } from './exampleRouter';

export const router = createBrowserRouter([
  {
    // 인증 전/후 모든 화면의 공통 부모 — GlobalAlertModal 을 여기서 마운트한다
    element: <RootLayout />,
    children: [
      // 루트 접근은 인증 상태에 맞는 기본 화면으로 보낸다
      { path: '/', element: <RootRedirect /> },
      ...authRouter,
      // 인증 필요 routes — shared Shell 로 감싼다
      {
        element: <RequireAuth />,
        children: [
          {
            element: <AppShell />,
            children: [...analysisRouter, ...exampleRouter, ...dashboardRouter], // 각 feature 라우터를 합친다
          },
        ],
      },
      // 그 외 매칭되지 않는 모든 경로는 404 페이지
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
