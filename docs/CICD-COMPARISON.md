# CI/CD 구성 비교 — gba-cmmn-frontend 대조 분석

이 저장소의 CI/CD 구성을 사내에서 **실제로 운영 중인** `gba-cmmn-frontend` 와 대조한 기록이다.

지금 구성은 `revenue-agent/frontend` 를 참고해 만들었는데, 그쪽도 아직 클러스터에 올라가지
않은 미검증 구성이다. 반면 gba 는 Azure ACR·Helm(OCI)·ArgoCD·KEDA·self-hosted 러너로
돌아가는 조직 표준이 그대로 담겨 있다. **배포 인프라가 확정되지 않은 지금, 나중에 사내로
옮길 때 무엇이 막히는지를 미리 적어두는 것**이 이 문서의 목적이다.

> 이 문서는 분석만 한다. 여기 적힌 "흡수할 항목"은 **아직 적용하지 않았다.**
> 실제 배포 절차는 [DEPLOYMENT.md](./DEPLOYMENT.md) 를 본다.

---

## 1. 배포 모델 — 무엇을 자동화하고 무엇을 사람이 하는가

**GitHub Actions 는 이미지를 굽고 레지스트리에 올리는 데까지만 한다.
그 다음은 ArgoCD 화면에서 사람이 이미지를 직접 넣고 SYNC 한다.**

gba 도 결국 같은 흐름이다. `ci-helm.yml` 의 마지막 스텝이
`✅ Print Helm Chart Version for ArgoCD` 로 버전 문자열을 출력하고 끝난다 —
사람이 그 값을 ArgoCD 에 옮겨 넣는 전제다. 택한 모델이 조직 관행과 어긋나지 않는다.

### 이 선택이 바꾸는 것

이건 GitOps 가 아니라 **"레지스트리 + 수동 승격"** 모델이다. ArgoCD 가 Git 을 진실의
원천으로 삼지 않으므로 몇 가지가 따라온다.

**지금 무엇이 떠 있는지 Git 으로 알 수 없다.** 배포 상태는 ArgoCD 안에만 있다.
`git log` 를 아무리 봐도 "dev 에 지금 어떤 커밋이 올라가 있나"를 알 수 없다.

**그래서 불변 sha 태그가 이 모델에서 오히려 더 중요해진다.** UI 에 붙여넣는 문자열이
곧 유일한 배포 기록이기 때문이다. 이 관점에서 gba 의 dev 가 고정 `latest` 인 것은
특히 나쁘다 — 무엇을 넣었는지 태그가 아무 정보도 주지 않는다. 롤백하려면 "이전에
뭐가 떠 있었지"를 ArgoCD 히스토리나 레지스트리에서 되짚어야 한다.

**`k8s/overlays/*/kustomization.yaml` 의 `newTag` 는 초기값일 뿐이다.**
ArgoCD UI 에서 넣은 이미지 오버라이드는 Application spec 의
`spec.source.kustomize.images` 에 저장되어 Git 값을 이긴다. overlay 자체는 ArgoCD 가
렌더링할 소스로 계속 필요하지만, **태그만큼은 Git 이 진실이 아니다.**

**ArgoCD Application 정의는 이 저장소에 두지 않는다.** UI 에서 직접 만든다.
저장소에 두면 Git 과 UI 두 곳이 같은 것을 주장하게 되고, 특히 `selfHeal` 이 켜져 있으면
수동 조작과 충돌한다. gba 도 Application 을 저장소에 두지 않는다.

---

## 2. 한눈에 보는 차이

| 계층               | gba-cmmn-frontend                                | 이 저장소                             |
| ------------------ | ------------------------------------------------ | ------------------------------------- |
| 러너               | `group: organization/Default` (조직 self-hosted) | `ubuntu-latest`                       |
| 레지스트리         | 환경별 Azure ACR (`vars.ACR_DEV/STG/PRD`)        | 미정 (`secrets.REGISTRY_URL`)         |
| 인증               | `Azure/login` → IP 화이트리스트 → `az acr login` | `docker/login-action` (ID/PW)         |
| 이미지 빌드        | 환경별 Dockerfile **3벌**                        | 1벌 + `ARG BUILD_ENV`                 |
| base image         | 사내 커스텀 (`gba-frontend-node:20.12.2`)        | 공식 `node:24-alpine`                 |
| 배포 패키징        | Helm chart → ACR 에 OCI push                     | Kustomize base/overlays               |
| 이미지 태그        | dev `latest`, stg/prd `<ver>-<env>-<타임스탬프>` | 전 환경 `<env>-<short-sha>`           |
| `imagePullPolicy`  | `Always`                                         | `IfNotPresent`                        |
| 오토스케일         | KEDA `ScaledObject` (prd 만)                     | 없음 (replicas 고정)                  |
| 코드 검증          | **없음**                                         | typecheck + lint + format + 빌드 확인 |
| PR 트리거          | 없음 (push 만)                                   | PR + push                             |
| 의존성 설치        | `npm install --force`, lock 미커밋               | `npm ci`, lock 커밋                   |
| 컨테이너 실행 유저 | root (`EXPOSE 80`)                               | non-root uid 101 (`8080`)             |
| probe              | **없음**                                         | readiness + liveness (`/healthz`)     |
| 레거시 병존        | Jenkins 3벌 + raw k8s manifest                   | 없음                                  |

---

## 3. 근본적으로 다른 3가지

표에 있는 차이 대부분은 취향이나 성숙도 문제라 나중에 맞추면 된다. 아래 셋은 다르다.
**사내로 옮기는 순간 그냥은 동작하지 않는 것들**이다.

### 3-1. 레지스트리 인증 — 지금 방식으로는 로그인 자체가 실패한다

지금은 `docker/login-action@v3` 에 `REGISTRY_URL`/`USERNAME`/`PASSWORD` 를 넘긴다.
평범한 방식이고, 공개 레지스트리나 방화벽 없는 사설 레지스트리에서는 잘 동작한다.

사내 ACR 은 **네트워크 규칙으로 잠겨 있다.** gba 는 이 때문에 네 단계를 밟는다.

1. `Azure/login@v2` — 서비스 주체로 Azure 인증 (`secrets.AZURE_CREDENTIALS_*`)
2. `haythem/public-ip@v1.3` — 러너의 공인 IP 를 알아낸다
3. `az acr network-rule add` — 그 IP 를 ACR 방화벽에 추가
4. `az acr login` — 그제서야 푸시할 수 있다

ID/PW 를 아무리 정확히 넣어도 3번을 건너뛰면 연결 자체가 거부된다.
**사내 ACR 로 간다면 `release.yml` 의 로그인 스텝을 통째로 갈아야 한다.**

> ⚠ gba 의 이 로직에는 결함이 있다. IP 를 **추가만 하고 제거하지 않는다.**
> 실행할 때마다 규칙이 쌓이고 ACR 의 IP 규칙 상한(100개)에 닿는다.
> 그대로 베끼지 말고 `if: always()` 조건의 cleanup 스텝을 붙여야 한다.
> self-hosted 러너의 IP 가 고정이라면 2~3번 자체가 불필요할 수도 있다 — 확인 후 결정한다.

### 3-2. 배포 패키징 단위 — Helm 이 조직 표준이면 Kustomize 는 이질적이다

gba 는 Helm 차트를 패키징해 ACR 에 OCI 아티팩트로 민다.

```
helm package → helm push oci://<acr>/cmn/helm → ArgoCD 가 chart 버전을 소비
```

환경 차이는 `{dev,stg,prd}-values.yaml` 로 관리하고, CI 가 `cp <env>-values.yaml values.yaml`
후 `sed` 로 이미지 태그를 박아 넣는다.

이 저장소는 Kustomize `base/` + `overlays/{dev,stg,prod}/` 다. 기술적으로는 어느 쪽도
우열이 없다. 차트를 버전 아티팩트로 남기면 "이 배포에 쓰인 매니페스트"가 통째로 보존되고,
Kustomize 는 매니페스트 전체가 Git 에 평문으로 남아 diff 와 리뷰가 쉽다.

**판단 기준은 조직 표준이다.** 사내 ArgoCD 가 OCI Helm 차트를 소비하도록 세팅되어 있다면
Kustomize 소스를 등록하는 것 자체가 예외 케이스가 된다. 확정되면 그때 전환한다.

> ⚠ gba 의 태그 주입 방식도 그대로 베끼지 말 것.
> `sed -i "s/^\(\s*tag:\s*\).*$/\1$TAG/"` 는 values.yaml 에 `tag:` 키가 둘 이상이면
> **전부** 치환한다. 지금은 하나뿐이라 우연히 동작한다.

### 3-3. 아키텍처 전제 — gba 는 SPA 가 아니라 micro-frontend remote 다

이게 가장 놓치기 쉬운 차이다. gba 의 nginx 설정과 ingress 를 그대로 참고하면 안 된다.

| 항목      | gba                                  | 이 저장소                       |
| --------- | ------------------------------------ | ------------------------------- |
| 진입점    | `remoteEntry.js` (Module Federation) | `index.html`                    |
| 서빙 경로 | `/gbaa/remote/common` 서브패스       | 루트 `/`                        |
| nginx     | `alias` 로 서브패스 매핑             | `try_files` SPA fallback        |
| 라우팅    | 호스트 셸이 담당                     | `createBrowserRouter` 자체 처리 |

gba 는 포털 셸에 얹히는 remote 라 자기 자신만으로는 화면이 되지 않는다. 이 저장소는
독립 SPA 이고 `vite` 설정에 `base` 가 없어 **루트 경로 배포를 전제**한다.

**analysis-agent 도 포털 서브패스에 얹혀야 한다면** `vite` 의 `base`, Module Federation
플러그인, nginx 의 `alias` 구조가 전부 바뀐다. 인프라 확정 시 가장 먼저 확인할 항목이다.

---

## 4. 현재 구성을 유지하는 이유

gba 가 실운영 구성이라고 해서 전부 따라갈 이유는 없다. 아래는 지금 방식이 나은 항목이다.

**코드 검증이 있다.** gba 에는 lint·typecheck·format·test 스텝이 **하나도 없다.**
워크플로 이름은 `CI and ACR push` 지만 실제로 하는 일은 빌드와 푸시뿐이고, PR 트리거도
없어서 머지 전에 걸러지는 게 없다. 이 저장소의 `ci.yml` 은 `npm run validate` 와
빌드 확인을 PR 에서 돌린다.

**`npm ci` + lock 커밋.** gba 는 `npm install --force` 를 쓰고 `package-lock.json` 을
gitignore 하며 `.npmrc` 에 `legacy-peer-deps=true` 까지 걸어두었다. 같은 커밋이라도
빌드 시점에 따라 다른 의존성 트리가 나온다. `--force` 는 peer dependency 충돌을 무시해
빌드 에러 대신 조용히 깨진 트리를 만든다.

**Dockerfile 1벌 + `ARG BUILD_ENV`.** gba 는 `{dev,stg,prd}-dockerfile` 3벌을 두는데
내용이 거의 같고 이미 드리프트가 있다 — `npm cache clean --force` 가 stg/prd 에만 있다.
(gba 가 3벌로 나눈 진짜 이유는 `FROM` 의 ACR 주소가 환경마다 다르기 때문이다.
그건 `ARG BASE_IMAGE` 로 해결할 수 있다.)

**컨테이너 보안과 헬스체크.**

| 항목                     | gba      | 이 저장소                                   |
| ------------------------ | -------- | ------------------------------------------- |
| 실행 유저                | root     | non-root uid 101                            |
| `readOnlyRootFilesystem` | 없음     | 있음 (+ `/tmp` emptyDir)                    |
| `capabilities drop`      | 없음     | `ALL`                                       |
| `seccompProfile`         | 없음     | `RuntimeDefault`                            |
| readiness/liveness probe | **없음** | `/healthz` 양쪽                             |
| 배포 전략                | 기본     | `maxUnavailable: 0` + `minReadySeconds: 30` |

probe 가 없다는 건 실제 위험이다. 기동에 실패한 파드로도 트래픽이 간다.
실제로 gba 의 Deployment 는 `containerPort: 8080` 인데 nginx 는 `listen 80` 이고
Service `targetPort` 도 80 이다. **선언이 틀렸는데 `containerPort` 가 정보성 필드라
우연히 동작하고 있다.** probe 가 있었다면 드러났을 종류의 불일치다.

**불변 sha 태그.** 1절에서 적었듯 수동 SYNC 모델에서는 UI 에 넣는 문자열이 유일한
배포 기록이라 오히려 더 중요하다.

**`type=gha` 레이어 캐시.** gba 는 `actions/cache` + `type=local` 을 쓰는데 캐시 키와
경로를 직접 관리해야 한다. `type=gha` 는 그 부담이 없다. self-hosted 러너로 옮겨도
그대로 동작한다.

---

## 5. gba 에서 흡수할 가치가 있는 것

**아직 적용하지 않았다.** 필요해지는 시점에 아래 위치에 넣는다.

| 항목                            | 넣을 위치                                       | 근거                                                       |
| ------------------------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| `TZ: Asia/Seoul` 컨테이너 env   | `k8s/base/deployment.yaml` 컨테이너 `env`       | 로그 타임스탬프가 KST 로 찍혀 장애 대조가 쉬워진다         |
| `revisionHistoryLimit: 3`       | `k8s/base/deployment.yaml` `spec`               | 현재 미지정이라 기본값 10 — ReplicaSet 누적 억제           |
| `imagePullSecrets`              | `k8s/base/deployment.yaml` `spec.template.spec` | 사내 프라이빗 레지스트리 전환 시 **필수**, 지금 없음       |
| 태그에 KST 타임스탬프 병기      | `release.yml` 태그 생성 스텝                    | `<env>-<yymmdd-HHMM>-<sha>` — 추적성과 가독성 양립         |
| `workflow_dispatch` + 버전 입력 | `release.yml` `on:`                             | 커밋 없이 stg/prd 재빌드. 지금은 브랜치 push 로만 굽는다   |
| `ARG BASE_IMAGE=node:24-alpine` | `docker/Dockerfile` builder 스테이지            | 사내망에서 docker.io 가 막힐 때 한 줄로 대응               |
| KEDA `ScaledObject`             | `k8s/base/` 신규 매니페스트                     | 조직 표준이 HPA 가 아니라 **KEDA** 라는 정보 자체가 중요   |
| `nodeSelector`                  | `k8s/base/deployment.yaml`                      | 클러스터에 노드 풀 구분(`nodetype: task` 등)이 있으면 필요 |

KST 처리 방식 하나는 바꿔서 흡수한다. gba 는 `date -d '9 hour'` 로 UTC+9 를 하드코딩하는데,
`TZ=Asia/Seoul date +%y%m%d-%H%M` 가 의도가 분명하고 서머타임 같은 예외에도 안전하다.

KEDA 는 정적 SPA 라 부하가 낮아 우선순위가 높지 않다. 다만 **사내 클러스터가 HPA 가 아니라
KEDA 로 오토스케일을 한다**는 사실 자체가 이관 시 알아야 할 정보다.

---

## 6. 가져오면 안 되는 것

gba 에 있지만 이식하면 안 되는 패턴이다. 이유와 함께 남긴다.

**`kubectl delete` → `kubectl apply` (Jenkins)** — `jenkins/*-jenkinsfile` 의 배포 스테이지는
Deployment·Service·Ingress 를 **지우고 다시 만든다.** 롤링 업데이트가 아니라서
**그 사이 다운타임이 발생한다.** 레거시 파이프라인이지만 절대 따라하면 안 되는 패턴이다.

**ACR IP 규칙을 추가만 하는 로직** — 3-1 에서 적었다. cleanup 없이는 규칙이 누적된다.

**`npm install --force` 와 lock 미커밋** — 재현성을 포기하는 선택이다.
같은 커밋이 빌드 시점에 따라 다른 결과를 낸다.

**환경별 Dockerfile 3벌** — 복붙 드리프트가 이미 발생했다. `ARG` 로 해결할 문제다.

**차트 디렉터리 복제** — `helm/gba-cmmn-frontend` 와 `helm/gba-cmmn-test-frontend` 가
거의 동일한 사본인데 이미 값이 갈렸다 (cpu request `100m` vs `1`).
비슷한 배포가 필요하면 차트를 복사하지 말고 values 를 하나 더 만든다.

**root 실행 · probe 없음 · 보안 컨텍스트 없음** — 4절 표 참고.

**`.npmrc` 에 로컬 절대경로 커밋** — gba 의 `.npmrc` 에는
`cwebp=E:\SK-Project\Develop\.config\cwebp-bin\cwebp.exe` 같은 개인 PC 경로가 들어 있다.
다른 개발자와 CI 에서 깨진다. 개인 설정은 커밋하지 않는다.

---

## 7. 아직 정리하지 않은 불일치

수동 SYNC 모델을 확정하면서 지금 구성에 남은 어긋남이다. **이번에는 손대지 않았다.**

**`release.yml` 의 요약 스텝이 Kustomize 명령을 출력한다.** 지금은
`kustomize edit set image ...` 를 출력하는데, 이 모델에서 필요한 건 **ArgoCD UI 에
그대로 붙여넣을 전체 이미지 경로**다. gba 가 차트 버전을 출력하는 것과 같은 역할이다.
바꾼다면 요약에 `<레지스트리>/analysis-agent/frontend:<env>-<sha>` 한 줄을 크게 남기는 편이 낫다.

**overlay 의 `newTag` 가 실제 배포 태그처럼 보인다.** 1절에서 적었듯 ArgoCD UI 오버라이드가
이를 이기므로 초기값에 불과하다. `newTag: dev-0000000` 옆에 그 사실을 주석으로 남겨두면
나중에 "왜 Git 값과 실제 배포가 다르지"로 헤매지 않는다.

**[DEPLOYMENT.md](./DEPLOYMENT.md) 7절의 태그 반영 절차**가 여전히
"`kustomize edit set image` 후 커밋" 흐름으로 적혀 있다. 수동 SYNC 로 확정했으므로
ArgoCD UI 절차로 다시 쓰는 편이 맞다.

---

## 8. 사내 이관 체크리스트

인프라가 확정되면 이 순서로 밟는다.

- [ ] **레지스트리가 ACR 인가 NCR 인가 확인** — gba 워크플로는 `vars.ACR_*` 로 푸시하는데
      helm values 의 image 는 `sk-abiz-d-ncr-main.neuro-skcnc-pub.ncr.ntruss.com`
      (네이버 클라우드 NCR) 이다. **변수명만 ACR 로 남은 이관 흔적으로 보인다.**
      실제 푸시 대상이 어디인지부터 확인해야 인증 방식이 정해진다.
- [ ] 독립 도메인인가, 포털 서브패스(`/gbaa/remote/...`) remote 인가 (3-3)
- [ ] 레지스트리가 네트워크 규칙으로 잠겨 있는가 → `release.yml` 로그인 스텝 교체 (3-1)
- [ ] self-hosted 러너 그룹을 쓸 수 있는가 → 두 워크플로의 `runs-on` 교체
- [ ] 조직 레벨 `vars`/`secrets` 를 쓸 수 있는가 (저장소 이관 여부에 달림)
- [ ] 조직 표준 배포 단위가 Helm 인가 → Kustomize 전환 시점 결정 (3-2)
- [ ] `imagePullSecrets` 이름 확인 후 `k8s/base/deployment.yaml` 에 추가
- [ ] 클러스터 ingress controller 확인 → `k8s/base/ingress.yaml` 의 `ingressClassName`
- [ ] 오토스케일이 필요하면 KEDA `ScaledObject` 추가 (HPA 아님)
- [ ] ArgoCD UI 에서 Application 생성 — 저장소에는 정의를 두지 않는다 (1절)
