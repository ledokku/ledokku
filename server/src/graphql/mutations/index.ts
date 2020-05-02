import { loginWithGithub } from './loginWithGithub';
import { saveDigitalOceanAccessToken } from './saveDigitalOceanAccessToken';
import { createDigitalOceanServer } from './createDigitalOceanServer';
import { deleteDigitalOceanServer } from './deleteDigitalOceanServer';
import { updateServerInfo } from './updateServerInfo';
import { createDatabase } from './createDatabase';
import { createApp } from './createApp';

export const mutations = {
  loginWithGithub,
  saveDigitalOceanAccessToken,
  createDigitalOceanServer,
  deleteDigitalOceanServer,
  updateServerInfo,
  createDatabase,
  createApp,
};
