import { removeDomain } from './removeDomain';
import { addDomain } from './addDomain';
import { setDomain } from './setDomain';
import { unsetEnvVar } from './unsetEnvVar';
import { setEnvVar } from './setEnvVar';
import { loginWithGithub } from './loginWithGithub';
import { createDatabase } from './createDatabase';
import { createApp } from './createApp';
import { destroyApp } from './destroyApp';
import { destroyDatabase } from './destroyDatabase';
import { linkDatabase } from './linkDatabase';
import { unlinkDatabase } from './unlinkDatabase';
import { addAppProxyPort } from './addAppProxyPort';
import { removeAppProxyPort } from './removeAppProxyPort';
import { restartApp } from './restartApp';

export const mutations = {
  loginWithGithub,
  createDatabase,
  createApp,
  setEnvVar,
  unsetEnvVar,
  destroyApp,
  restartApp,
  destroyDatabase,
  linkDatabase,
  unlinkDatabase,
  addAppProxyPort,
  removeAppProxyPort,
  removeDomain,
  addDomain,
  setDomain,
};
