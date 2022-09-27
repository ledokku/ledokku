import { createAppGithub } from './createAppGithub';
import { removeDomain } from './removeDomain';
import { addDomain } from './addDomain';
import { setDomain } from './setDomain';
import { unsetEnvVar } from './unsetEnvVar';
import { setEnvVar } from './setEnvVar';
import { createDatabase } from './createDatabase';
import { createAppDokku } from './createAppDokku';
import { destroyApp } from './destroyApp';
import { destroyDatabase } from './destroyDatabase';
import { linkDatabase } from './linkDatabase';
import { unlinkDatabase } from './unlinkDatabase';
import { addAppProxyPort } from './addAppProxyPort';
import { removeAppProxyPort } from './removeAppProxyPort';
import { restartApp } from './restartApp';
import { rebuildApp } from './rebuildApp';
import { registerGithubApp } from './registerGithubApp';

export const mutations = {
  createDatabase,
  createAppDokku,
  createAppGithub,
  setEnvVar,
  unsetEnvVar,
  destroyApp,
  restartApp,
  destroyDatabase,
  linkDatabase,
  unlinkDatabase,
  addAppProxyPort,
  removeAppProxyPort,
  rebuildApp,
  removeDomain,
  addDomain,
  setDomain,
  registerGithubApp,
};
