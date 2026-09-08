const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  deployEnv: import.meta.env.VITE_DEPLOY_ENV,
};

export default env;

/**
 * 배포 환경을 가져오는 함수 (local, dev, stg, prod)
 * @returns {string} The deployment environment
 */
export const getDeployMode = () => {
  return env.deployEnv;
};
