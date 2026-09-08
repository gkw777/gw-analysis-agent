import { http, HttpResponse } from 'msw';
import { dashboardData } from './dashboardMockData';

export const dashboardHandlers = [
  http.get('*/api/dashboard', () =>
    HttpResponse.json({ status: 200, data: dashboardData, message: '정상 데이터 호출되었습니다.' })
  ),
];
