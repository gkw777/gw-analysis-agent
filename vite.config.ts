import { defineConfig, loadEnv } from 'vite';
import { getConfig } from './vite/index';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  console.log('current mode:', mode);
  console.log('load env:', env);

  return getConfig(env);
});
