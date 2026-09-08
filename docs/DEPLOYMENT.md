# 배포 가이드

Git → GitHub Actions → Docker → 사내 레지스트리 → (ArgoCD 수동 SYNC → 쿠버네티스) 파이프라인 문서.

**자동화는 레지스트리에 이미지를 올리는 데서 끝난다.** 그 다음은 ArgoCD 화면에서
사람이 이미지 태그를 넣고 SYNC 한다. 이 선택이 무엇을 바꾸는지는
[CICD-COMPARISON.md 1절](./CICD-COMPARISON.md) 에 정리해두었다.

> **현재 적용 범위**: 레지스트리에 이미지를 푸시하는 데까지다.
> `k8s/` 매니페스트는 작성되어 있지만 **클러스터에 적용하지 않았다.**

---

## 0. 저장소 구조와 전제

`gw-analysis-agent` 는 프론트엔드가 곧 저장소 루트다. 그래서 `.github/workflows/` 가
루트에 있고 **경로 보정 없이 그대로 동작한다.**

```
.                             ← 저장소 루트 = 프론트엔드 루트
├─ .github/workflows/
│  ├─ ci.yml                  검증 (PR/푸시)
│  └─ release.yml             이미지 빌드 + 레지스트리 푸시
├─ docker/
│  ├─ Dockerfile              빌드 컨텍스트는 저장소 루트
│  ├─ nginx.conf
│  └─ docker-compose.yml      로컬에서 3환경 동시 기동
├─ .dockerignore              ← 컨텍스트 루트여야 하므로 docker/ 안이 아니다
├─ k8s/
│  ├─ base/                   공통 매니페스트
│  └─ overlays/{dev,stg,prod}/
└─ docs/
   ├─ DEPLOYMENT.md           이 문서
   └─ CICD-COMPARISON.md      사내 gba-cmmn-frontend 구성과의 대조 분석
```

ArgoCD Application 정의는 **저장소에 두지 않는다.** ArgoCD 화면에서 직접 만든다.
저장소에도 두면 Git 과 UI 두 곳이 같은 것을 주장하게 되어, 수동으로 넣은 이미지와
Git 의 값이 어긋났을 때 어느 쪽이 맞는지 알 수 없어진다.

---

## 1. 브랜치 = 환경

| 브랜치    | 환경 | 빌드 스크립트 | env 파일           | 네임스페이스          | ArgoCD 동기화 |
| --------- | ---- | ------------- | ------------------ | --------------------- | ------------- |
| `develop` | dev  | `build:dev`   | `.env.development` | `analysis-agent-dev`  | **수동**      |
| `staging` | stg  | `build:stg`   | `.env.staging`     | `analysis-agent-stg`  | **수동**      |
| `release` | prod | `build:prod`  | `.env.production`  | `analysis-agent-prod` | **수동**      |

세 환경 모두 사람이 ArgoCD 화면에서 이미지를 넣고 SYNC 한다. 자동 동기화는 쓰지 않는다.

머지 흐름: `feature/* → develop → staging → release`

`staging` / `release` 브랜치는 아직 만들지 않았다. 승격이 필요해지는 시점에 만든다.

```bash
git switch -c staging develop && git push -u origin staging   # stg 승격 시
git switch -c release staging && git push -u origin release   # prod 승격 시
```

### 승격 절차

각 단계에서 **사람이 화면을 확인한 뒤** 다음으로 넘어간다.

```
develop 푸시 → dev 이미지 자동 빌드 → dev 화면 확인
   ↓ (확인 완료)
staging 머지 → stg 이미지 자동 빌드 → stg 화면 확인
   ↓ (확인 완료)
release 머지 → prod 이미지 자동 빌드 → prod 화면 확인
```

---

## 2. 왜 환경마다 이미지를 따로 굽는가

`VITE_*` 환경변수는 **빌드 타임에 번들에 문자열로 박힌다**
([src/shared/utils/env.ts](../src/shared/utils/env.ts)).
컨테이너 환경변수를 바꿔도 이미 빌드된 JS 는 달라지지 않는다.
그래서 dev/stg/prod 이미지를 각각 빌드한다.

**주의**: `.env.development` / `.env.staging` / `.env.production` 의 `VITE_API_BASE_URL` 이
**셋 다 `http://localhost:8000/api`** 로 되어 있다. 이대로 이미지를 구우면
**사용자 브라우저가 자기 자신의 localhost 를 호출한다.** 실제 API 도메인으로 교체해야 한다.
이 파일들은 Git 에 커밋되므로 비밀값은 넣지 않는다.

### MSW 목 데이터

[src/main.tsx](../src/main.tsx) 의 `enableMocking()` 은 `getDeployMode() === 'local'` 일 때만
`@/mocks/browser` 를 **동적 import** 한다. dev/stg/prod 번들에서는 그 청크가 로드되지 않으므로
목 데이터가 실제 API 를 가로챌 일은 없다.

다만 `public/mockServiceWorker.js` 는 `public/` 에 있어 **모든 빌드의 `dist/` 에 복사된다.**
등록되지 않으므로 동작에는 영향이 없고, 신경 쓰인다면 prod 빌드 후 삭제하는 스텝을 추가한다.

---

## 3. GitHub Actions

| 워크플로                                                          | 트리거                             | 하는 일                                                |
| ----------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| [.github/workflows/ci.yml](../.github/workflows/ci.yml)           | PR / 푸시                          | `npm run validate` (typecheck·lint·format) + 빌드 확인 |
| [.github/workflows/release.yml](../.github/workflows/release.yml) | `develop`/`staging`/`release` 푸시 | 이미지 빌드 → 레지스트리 푸시                          |

문서·매니페스트(`docs/`, `k8s/`, `argocd/`, `*.md`)만 바뀐 커밋은 둘 다 건너뛴다.

### 등록해야 할 Secrets

레지스트리가 정해지면 저장소 Settings → Secrets and variables → Actions 에 등록한다.
**셋 다 등록하기 전에 `develop` 을 푸시하면 `release` 가 로그인 단계에서 실패한다.**

| 이름                | 예시                 |
| ------------------- | -------------------- |
| `REGISTRY_URL`      | `harbor.company.com` |
| `REGISTRY_USERNAME` | `robot$ci`           |
| `REGISTRY_PASSWORD` | (토큰)               |

이미지 경로 `analysis-agent/frontend` 는 비밀이 아니므로 워크플로의 `env:` 에 있다.

### 사내망 레지스트리라면

GitHub 호스티드 러너에서 사내망에 닿지 않으면 두 워크플로의 `runs-on` 을 바꾼다.

```yaml
runs-on: [self-hosted, linux, x64]
```

### 이미지 태그

| 태그                | 용도                                                           |
| ------------------- | -------------------------------------------------------------- |
| `<env>-<short-sha>` | **실제 배포용.** 불변이라 롤백 대상이 명확하다                 |
| `<env>-latest`      | 사람이 확인할 때 쓰는 편의용. **매니페스트에서는 쓰지 않는다** |

`-latest` 를 매니페스트에 쓰면 `imagePullPolicy: IfNotPresent` 와 맞물려
노드가 옛 이미지를 재사용하고, 롤백할 대상도 특정할 수 없다.

---

## 4. 의존성 설치 방식 — `npm ci`

이 저장소는 **`package-lock.json` 을 커밋한다.** 그래서 CI 와 Docker 모두 `npm ci` 를 쓴다.
lock 에 적힌 버전을 그대로 설치하므로 **같은 커밋은 언제 빌드해도 같은 트리**가 나온다.
stg 에서 확인한 번들과 prod 번들이 달라질 여지가 없다.

여기에 두 가지가 따라온다.

1. `actions/setup-node` 의 `cache: npm` 을 그대로 쓸 수 있다 (lock 파일을 찾아 캐시 키를 만든다).
2. `.dockerignore` 가 `package-lock.json` 을 **제외하면 안 된다.** 제외하면 `npm ci` 가 실패한다.

> 참고 — revenue-agent/frontend 는 lock 을 커밋하지 않아 `npm install` + `actions/cache` 로
> `~/.npm` 을 직접 캐싱하고, `.dockerignore` 에서 lock 을 제외한다. 이 저장소는 반대 선택이다.
> 만약 lock 커밋을 그만둔다면 위 세 곳(워크플로 캐시·설치 명령·`.dockerignore`)을 함께 되돌려야 한다.

`--force` 는 쓰지 않는다. peer dependency 충돌을 무시해 깨진 트리를 조용히 만든다.
충돌이 실제로 생기면 그때 범위가 좁은 `--legacy-peer-deps` 를 검토한다.

---

## 5. 로컬에서 이미지 확인

**저장소 루트에서 실행한다.** Dockerfile 은 `docker/` 에 있지만 빌드 컨텍스트는 루트다.

```bash
docker compose -f docker/docker-compose.yml up --build frontend-dev   # dev 만 (http://localhost:8081)
docker compose -f docker/docker-compose.yml up --build                # 셋 다 (8081 / 8082 / 8083)
docker compose -f docker/docker-compose.yml down
```

compose 없이 직접 굽는다면:

```bash
docker build -f docker/Dockerfile --build-arg BUILD_ENV=dev -t analysis-agent-frontend:local .
docker run --rm -p 8081:8080 analysis-agent-frontend:local
```

`VITE_*` 가 빌드 타임에 박히므로 환경을 바꾸려면 **반드시 `--build`** 가 필요하다.

### 확인 항목

```bash
# SPA fallback — 직접 진입/새로고침이 404 나면 안 된다
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8081/analysis   # 200

# probe
curl -s http://localhost:8081/healthz                                     # ok

# 캐시 헤더 — 배포 반영의 핵심
curl -sI http://localhost:8081/ | grep -i cache-control                   # no-store, must-revalidate
curl -sI http://localhost:8081/js/<해시>.js | grep -i cache-control       # public, max-age=31536000, immutable

# non-root
docker compose -f docker/docker-compose.yml exec frontend-dev id -u       # 101 (0 이면 안 됨)
```

---

## 6. 캐시 정책 — "새 이미지를 올렸는데 옛 화면이 보인다" 방지

빌드 산출물은 파일명에 콘텐츠 해시가 붙는다 (`js/index.DfejLDwh.js`).
내용이 바뀌면 **URL 자체가 바뀌므로** 브라우저가 옛 파일을 재사용할 수 없다.
[vite/vite.dev.ts](../vite/vite.dev.ts) 와 [vite/vite.prod.ts](../vite/vite.prod.ts) 가
dev/stg/prod 모두에 `[hash:8]` 을 걸어두었다.

위험한 건 이름이 고정된 `index.html` 하나뿐이다. 여기에 "어떤 js 를 로드할지" 가 적혀 있어서,
이게 캐시되면 새 이미지를 배포해도 옛 번들을 계속 가리킨다.

| 경로               | 헤더                                  |
| ------------------ | ------------------------------------- |
| `/js/`, `/assets/` | `public, max-age=31536000, immutable` |
| `/index.html`      | `no-store, must-revalidate`           |

전체를 `no-store` 로 두면 MUI·recharts 가 포함된 번들을 매 방문마다 다시 받게 되어
첫 화면 체감 속도만 나빠진다. 설정은 [docker/nginx.conf](../docker/nginx.conf) 에 있다.

### 배포 중 청크 404

지금 [src/routers/index.tsx](../src/routers/index.tsx) 는 라우트를 정적 import 로 조립한다
(`React.lazy` 미사용). 그래서 배포 직후 옛 청크를 요청하는 상황은 사실상 없다.

라우트 단위 코드 스플리팅을 도입하면 얘기가 달라진다. 구버전 `index.html` 을 받아둔 브라우저
(탭을 오래 열어둔 사용자)가 배포 이후 옛 해시의 청크를 요청해 404 가 난다. 대비는 두 겹이다.

- **k8s**: `minReadySeconds: 30` + `maxUnavailable: 0` — 이미 걸어두었다. 구 파드를 곧바로 내리지 않는다.
- **프론트**: 청크 로드 실패 시 1회 새로고침하는 `lazyWithRetry` 유틸. **이 저장소에는 아직 없다.**
  revenue-agent/frontend 의 `src/shared/utils/lazyWithRetry.ts` 를 참고해 도입한다.

---

## 7. 쿠버네티스 매니페스트 (아직 적용 안 함)

```
k8s/base/                     공통
k8s/overlays/{dev,stg,prod}/  환경별 차이
```

클러스터 없이 렌더링만으로 검증할 수 있다. **저장소 루트에서 실행한다.**

```bash
kubectl kustomize k8s/overlays/dev
kubectl kustomize k8s/overlays/stg
kubectl kustomize k8s/overlays/prod
```

### 적용 전에 채워야 할 플레이스홀더

| 위치                        | 현재 값                    | 채울 것                       |
| --------------------------- | -------------------------- | ----------------------------- |
| overlays `images[].newName` | `PLACEHOLDER_REGISTRY/...` | 실제 레지스트리 주소          |
| overlays ingress host       | `*.example.local`          | 실제 도메인                   |
| base `ingressClassName`     | `nginx`                    | 클러스터의 ingress controller |

ArgoCD Application 은 저장소에 두지 않고 ArgoCD 화면에서 직접 만든다. 등록할 때
source 는 이 저장소(`gw-analysis-agent.git`)의 `k8s/overlays/<env>` 를 가리키고,
sync policy 는 **automated 없이** 둔다.

### 이미지 태그를 반영

`release` 실행 결과 요약(Actions → 해당 실행 → Summary)에 이번에 푸시된 태그가 남는다.
그 이미지를 **ArgoCD 화면의 이미지 파라미터에 넣고 SYNC** 한다.

```
<레지스트리>/analysis-agent/frontend:dev-<sha>
```

overlay 의 `newTag` 는 **초기값일 뿐이다.** ArgoCD 화면에서 넣은 값이 Application spec
(`spec.source.kustomize.images`)에 저장되어 Git 값을 이긴다. 즉 태그만큼은 Git 이
진실이 아니므로, `k8s/overlays/*/kustomization.yaml` 의 `newTag` 를 보고 지금 무엇이
떠 있는지 판단하면 안 된다.

**롤백**은 재빌드가 아니라 ArgoCD 화면에서 이전 `<env>-<sha>` 이미지를 다시 넣고 SYNC 한다.
그래서 태그에 커밋 sha 를 박아 두는 것이 중요하다 — 넣는 문자열이 곧 유일한 배포 기록이다.

---

## 8. TODO — 다음 단계

- [ ] 레지스트리 주소 확정 → Secrets 등록, overlay `newName` 교체
- [ ] `.env.development` / `.env.staging` / `.env.production` 의 API 주소 교체 (현재 전부 localhost)
- [ ] 실제 도메인 확정 → overlay ingress host 교체
- [ ] 클러스터의 ingress controller 확인 → base `ingressClassName` 교체
- [ ] ArgoCD 화면에서 Application 3개 생성 (source = `k8s/overlays/<env>`, automated 없음)
- [ ] `release.yml` 요약 스텝이 아직 `kustomize edit set image` 명령을 출력한다 —
      ArgoCD 에 붙여넣을 이미지 경로를 출력하도록 교체
      ([CICD-COMPARISON.md 7절](./CICD-COMPARISON.md))
- [ ] 라우트 코드 스플리팅 도입 시 `lazyWithRetry` 함께 도입 (6절 참고)
- [ ] 사내 인프라 확정 시 [CICD-COMPARISON.md 8절](./CICD-COMPARISON.md) 이관 체크리스트 수행
