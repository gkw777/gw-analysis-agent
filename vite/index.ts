import { UserConfig } from 'vite';
import { getDevConfig } from './vite.dev';
import { getProdConfig } from './vite.prod';

interface EnvConfig {
  [key: string]: (env: Record<string, string>) => UserConfig;
}

const envConfigs: EnvConfig = {
  dev: getDevConfig,
  prod: getProdConfig,
};

// Determine the deployment environment based on the VITE_DEPLOY_ENV variable
const getDeployMode = (env: Record<string, string>): string => {
  const deployEnv = env.VITE_DEPLOY_ENV;
  if (deployEnv === 'local') {
    return 'dev';
  } else if (deployEnv === 'stg') {
    return 'prod';
  } else {
    return deployEnv;
  }
};

export const getConfig = (env: Record<string, string>): UserConfig => {
  const deployEnv = getDeployMode(env);
  const baseConfig: UserConfig = envConfigs[deployEnv](env);

  if (!baseConfig) {
    throw new Error(`No Vite config found for mode: ${deployEnv}`);
  }

  const config = {
    ...baseConfig,
    define: {
      ...baseConfig.define,
    },
  };

  return config;
};
