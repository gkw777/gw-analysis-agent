// dashboard feature 라우터 — MFE 전환 시 feature 와 함께 분리되는 단위.
// React.lazy 로 페이지를 동적 import 해 로그인 전에는 dashboard 번들(차트/표 포함)을 내려받지 않는다.
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { routePaths } from './paths';

const DashboardPage = lazy(async () =>
  import('@/features/dashboard').then(({ DashboardPage: DP }) => ({ default: DP }))
);

export const dashboardRouter: RouteObject[] = [
  {
    path: routePaths.dashboard,
    element: <DashboardPage />,
  },
];
