import { loginWithGithub } from './loginWithGithub';
import { saveDigitalOceanAccessToken } from './saveDigitalOceanAccessToken';
import { createDigitalOceanServer } from './createDigitalOceanServer';
import { updateServerInfo } from './updateServerInfo';
import { createDatabase } from './createDatabase';
import { createApp } from './createApp';

export const mutations = {
  loginWithGithub,
  saveDigitalOceanAccessToken,
  createDigitalOceanServer,
  updateServerInfo,
  createDatabase,
  createApp,
};
