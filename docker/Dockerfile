# syntax=docker/dockerfile:1
#
# 빌드는 반드시 저장소 루트를 컨텍스트로 실행한다:
#   docker build -f docker/Dockerfile --build-arg BUILD_ENV=dev -t analysis-agent-frontend:local .
# 또는 docker/docker-compose.yml 을 사용한다.

# ---------- builder ----------
FROM node:24-alpine AS builder

WORKDIR /app

# 매니페스트만 먼저 복사해 의존성 설치 레이어를 소스 변경과 분리한다.
# 둘 다 그대로면 이 레이어가 재사용되어 빌드가 빨라진다.
COPY package.json package-lock.json ./

# 이 저장소는 package-lock.json 을 커밋하므로 npm ci 를 쓴다.
# lock 에 적힌 버전을 그대로 설치하므로 CI 와 로컬이 같은 트리를 만든다.
#
# --force 는 쓰지 않는다. peer dependency 충돌을 무시하고 강제 설치하는 옵션이라
# 충돌이 생겼을 때 빌드 에러 대신 깨진 의존성 트리를 조용히 만든다.
RUN npm ci

COPY . .

# dev | stg | prod — package.json 의 build:<env> 스크립트를 그대로 호출한다.
# VITE_DEPLOY_ENV 와 vite mode 는 그 스크립트가 cross-env 로 넘기므로 여기서 손대지 않는다.
ARG BUILD_ENV=dev
RUN npm run build:${BUILD_ENV}

# ---------- runtime ----------
FROM nginx:1.27-alpine

# non-root(nginx, uid 101) 로 기동한다. k8s 의 runAsNonRoot 를 만족시키기 위한 것으로,
# 쓰기가 필요한 pid/temp 경로는 nginx.conf 에서 /tmp 로 옮겨두었다.
#
# 빌드 컨텍스트는 이 파일이 있는 docker/ 가 아니라 저장소 루트다.
# (docker build -f docker/Dockerfile .) 그래서 경로에 docker/ 가 붙는다.
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx

# 1024 미만 포트는 non-root 가 바인딩할 수 없으므로 80 이 아니라 8080 을 쓴다.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# 기본 이미지의 ENTRYPOINT(/docker-entrypoint.sh)는 root 를 전제로 한 초기화를 수행한다.
# non-root 로 돌리므로 우회하고 nginx 를 직접 띄운다.
ENTRYPOINT ["nginx", "-g", "daemon off;"]
