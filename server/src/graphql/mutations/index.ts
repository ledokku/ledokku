import { unsetEnvVar } from './unsetEnvVar';
import { setEnvVar } from './setEnvVar';
import { loginWithGithub } from './loginWithGithub';
import { createDatabase } from './createDatabase';
import { createApp } from './createApp';
import { destroyApp } from './destroyApp';

export const mutations = {
  loginWithGithub,
  createDatabase,
  createApp,
  setEnvVar,
  unsetEnvVar,
  destroyApp,
};
