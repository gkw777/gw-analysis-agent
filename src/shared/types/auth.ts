// 전역 공용 타입 — 인증. 백엔드 app/schemas.py 의 pydantic 모델과 대응된다.

export interface Auth {
  token: string;
  name: string;
  role: string;
}
