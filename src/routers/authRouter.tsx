// auth feature 라우터 — MFE 전환 시 feature 와 함께 분리되는 단위.
// React.lazy 로 페이지를 동적 import 해 feature 단위로 번들이 분할되게 한다.
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PublicOnly } from './guards';
import { routePaths } from './paths';

const LoginPage = lazy(async () => import('@/features/auth').then(({ LoginPage: LP }) => ({ default: LP })));

export const authRouter: RouteObject[] = [
  {
    element: <PublicOnly />,
    children: [
      {
        path: routePaths.login,
        element: <LoginPage />,
      },
    ],
  },
];
