import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const config = {
  githubClientId: publicRuntimeConfig.env.GITHUB_CLIENT_ID,
  serverUrl: publicRuntimeConfig.env.SERVER_URL,
};
