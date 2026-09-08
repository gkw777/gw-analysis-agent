import { http, HttpResponse } from 'msw';
import { coreQuestions, keywords, thresholdGroups } from './gnbMockData';
import { dashboardHandlers } from './dashboardHandlers';

export const handlers = [
  http.get('*/api/gnb/core-questions', () =>
    HttpResponse.json({ status: 200, data: coreQuestions, message: '정상 데이터 호출되었습니다.' })
  ),
  http.get('*/api/gnb/keywords', () =>
    HttpResponse.json({ status: 200, data: keywords, message: '정상 데이터 호출되었습니다.' })
  ),
  http.get('*/api/gnb/threshold-groups', () =>
    HttpResponse.json({ status: 200, data: thresholdGroups, message: '정상 데이터 호출되었습니다.' })
  ),
  ...dashboardHandlers,
];
