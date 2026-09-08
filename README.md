# 경영 분석 AI 에이전트 (analysis-agent)

경영진용 AI 분석 에이전트 프론트엔드. 복잡한 경영 데이터를 자연어로 질문하면, AI 에이전트가 분석하고 시각화된 보고서를 생성하는 시스템입니다.

## 주요 기능

- **AI 기반 자연어 분석**: 프롬프트로 경영 데이터 조회 및 분석
- **분할 뷰**: 대화창과 보고서를 좌우로 나란히 표시
- **다중 에이전트**: 여러 분석 에이전트 선택 가능
- **반응형 UI**: MUI + SCSS로 구성된 깔끔한 인터페이스

## 기술 스택

| 분류              | 기술                    |
| ----------------- | ----------------------- |
| **빌드**          | Vite 5                  |
| **프론트엔드**    | React 18 + TypeScript 5 |
| **UI 라이브러리** | MUI v5 + SCSS Modules   |
| **상태관리**      | Jotai                   |
| **라우팅**        | React Router v7         |
| **HTTP**          | Axios                   |
| **패널 분할**     | react-resizable-panels  |
| **개발 도구**     | ESLint + Prettier       |

## 시작하기

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작 (http://localhost:3000)
npm run dev

# 타입 체크, 린트, 포매팅 검증
npm run validate

# 환경별 빌드
npm run build:dev    # 개발 (VITE_DEPLOY_ENV=dev)
npm run build:stg    # 스테이징 (VITE_DEPLOY_ENV=stg)
npm run build:prod   # 프로덕션 (VITE_DEPLOY_ENV=prod)

# 개별 검증
npm run typecheck    # TypeScript 타입 체크
npm run lint         # ESLint
npm run lint:fix     # ESLint 자동 수정
npm run format:check # Prettier 포매팅 검증
npm run format       # 포매팅 적용
```

### 로그인

현재 로그인은 백엔드 연동 전 **임시 Mock** 상태입니다. 아무 아이디/비밀번호나 입력하면 통과합니다.
실제 인증 연동은 [LoginPage.tsx](src/features/auth/LoginPage.tsx)의 TODO를 참고하세요.

## 폴더 구조

```
src/
├── assets/                  # 공용 자산 (아이콘, SVG, 폰트 등)
├── shared/                  # 🔒 모든 팀원이 사용 가능
│   ├── components/
│   │   ├── commons/         # 순수 MUI 래퍼
│   │   │                    # (Button, Input, Modal, SelectBox, Checkbox,
│   │   │                    #  RadioGroup, FormControl, FormLabel, Switch, Tooltip...)
│   │   ├── layouts/         # 공용 레이아웃
│   │   │                    # (AppShell[GNB+타이틀바], Sidebar, Main 영역...)
│   │   └── specific/        # feature별 공용 컴포넌트
│   │                        # (예: 조직도 Modal, 공용 SelectBox...)
│   ├── hooks/               # 공용 커스텀 훅 (useToken, useUserInfo...)
│   ├── store/               # 전역 상태관리 (Jotai atoms)
│   ├── types/               # 공용 타입 정의
│   ├── utils/               # 유틸 함수 (formatter, apiClient...)
│   ├── styles/              # 공용 스타일 (theme, global, variables...)
│   └── constants/           # 공용 상수
│
├── features/                # 🎯 Feature별 격리 영역 (feature 간 import 금지)
│   ├── auth/                # 인증
│   │   ├── LoginPage.tsx    # 로그인 페이지 진입점
│   │   └── index.ts
│   │
│   └── analysis/            # 경영 분석 (메인 기능)
│       ├── components/      # analysis만의 컴포넌트
│       │   ├── AnalysisPrompt.tsx    # 대화 입력/출력 영역
│       │   └── report/
│       │       └── ReportPanel.tsx   # 보고서 표시 영역
│       ├── hooks/           # analysis만의 커스텀 훅
│       ├── store/           # analysis 상태관리 (chatAtoms, uiAtoms)
│       ├── types/           # analysis 타입 정의
│       ├── AnalysisPage.tsx # 메인 페이지 (분할뷰 관리)
│       └── index.ts
│
├── routers/                 # 라우팅 설정
│   ├── paths.ts             # 경로 상수
│   ├── guards.tsx           # 라우트 가드 (인증 등)
│   ├── authRouter.tsx       # 인증 라우터
│   ├── analysisRouter.tsx   # 분석 라우터
│   ├── NotFoundPage.tsx     # 404 페이지
│   ├── RootLayout.tsx       # 루트 레이아웃
│   └── index.tsx            # 라우터 조립
│
├── App.tsx                  # 최상위 컴포넌트
└── main.tsx                 # 진입점

vite/                        # 환경별 Vite 설정
├── common.ts
├── dev.ts
└── prod.ts
```

## 개발 컨벤션

자세한 내용은 다음 문서를 참고하세요:

- [폴더 구조 & 명명 규칙](.claude-convention.md)
- [협업 프롬프트](.claude-prompts.md)

### Import 규칙 (핵심)

✅ **허용**

- `@/shared/*` — 어디서든 접근 가능
- `@/features/[자기feature]/*` — 같은 feature 내에서만
- `./` 상대경로 — 같은 폴더 내

❌ **금지**

- 다른 feature에서 import (예: analysis에서 auth 직접 참조)

### 파일 명명

| 대상     | 규칙           | 예시                      |
| -------- | -------------- | ------------------------- |
| 폴더     | camelCase      | `auth/`, `analysis/`      |
| 컴포넌트 | PascalCase.tsx | `AnalysisPage.tsx`        |
| 훅       | camelCase.ts   | `useConversationReset.ts` |
| 서비스   | camelCase.ts   | `analysisAPI.ts`          |
| 스토어   | camelCase.ts   | `chatAtoms.ts`            |
| 타입     | camelCase.ts   | `chat.ts`                 |

## 주요 패턴

### 상태관리 (Jotai)

- **전역 상태**: `shared/store/` — 인증, 선택된 에이전트 등
- **Feature 상태**: `features/[name]/store/` — 채팅, UI 상태 등
- **로컬 상태**: 컴포넌트 내부 `useState` — UI 토글, 폼 입력 등

### 분할뷰

AnalysisPage에서 `react-resizable-panels`을 사용해 좌측 대화/우측 보고서를 분할하고, 레이아웃 비율을 localStorage에 저장합니다.

### 환경 변수

환경별 `.env.*` 파일에서 관리하며, 빌드 시 `VITE_DEPLOY_ENV`로 식별합니다:

- `.env.development` → local | dev
- `.env.staging` → stg
- `.env.production` → prod
