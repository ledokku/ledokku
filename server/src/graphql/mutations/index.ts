import { addEnvVar } from './addEnvVar';
import { loginWithGithub } from './loginWithGithub';
import { createDatabase } from './createDatabase';
import { createApp } from './createApp';
import { deleteApp } from './deleteApp';

export const mutations = {
  loginWithGithub,
  createDatabase,
  createApp,
  addEnvVar,
  deleteApp,
};
