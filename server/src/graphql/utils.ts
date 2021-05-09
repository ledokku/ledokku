import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';
import { OAuthApp } from '@octokit/oauth-app';
import * as yup from 'yup';
import { DatabaseTypes } from '../generated/graphql';
import { prisma } from '../prisma';
import { config } from '../config';

// Digital ocean token format = exactly 64 chars, lowercase letters & numbers
export const digitalOceanAccessTokenRegExp = /^[a-z0-9]{64}/;

// Validate the name to make sure there are no security risks by adding it to the ssh exec command.
// Only letters and "-" allowed
// TODO unit test this schema
const appNameYup = yup
  .string()
  .required()
  .matches(/^[a-z0-9-]+$/);

export const githubAppCreationSchema = yup.object({
  name: appNameYup,
});

export const appNameSchema = yup.object({
  name: appNameYup,
});

export const dbTypeToDokkuPlugin = (dbType: DatabaseTypes): string => {
  switch (dbType) {
    case 'MONGODB':
      return 'mongo';
    case 'POSTGRESQL':
      return 'postgres';
    case 'REDIS':
      return 'redis';
    case 'MYSQL':
      return 'mysql';
  }
};

export const refreshAuthToken = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      refreshToken: true,
    },
  });

  // const res = await octo.request(`POST /login/oauth/access_token`, {
  //   refresh_token: user.refreshToken,
  //   grant_type: 'refresh_token',
  //   client_id: config.githubAppClientId,
  //   client_secret: config.githubAppClientSecret,
  // });

  const app = new OAuthApp({
    clientType: 'github-app',
    clientId: config.githubAppClientId,
    clientSecret: config.githubAppClientSecret,
  });

  const { data } = await app.refreshToken({
    refreshToken: user.refreshToken,
  });

  const rn = new Date();
  const time = rn.getTime();
  const refreshTokenExpiresAt = new Date(time + data.refresh_token_expires_in);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: data.refresh_token,
      refreshTokenExpiresAt,
      githubAccessToken: data.access_token,
    },
  });

  return data.access_token;
};

// All the commented out files could be helpful
// TODO FIX TYPES : https://github.com/ledokku/ledokku/issues/371
// type InstallationParams = Endpoints['GET /user/installations'];
type InstallationsResponse = Endpoints['GET /user/installations']['response'];

export const octoRequestWithUserToken = async (
  requestData: string,
  // requestData: InstallationParams['request'],
  userGithubAccessToken: string,
  userId: string
) => {
  const octokit = new Octokit({
    auth: userGithubAccessToken,
  });

  // let res: InstallationsResponse;

  // type OctoResponse = GetResponseTypeFromEndpointMethod<typeof octokit.request>;

  let res: any;

  try {
    res = await octokit.request(requestData);
    // res = (await octokit.request(
    //   requestData as InstallationParams['request']
    // )) as InstallationsResponse;
  } catch (e) {
    if (e.message === 'Bad credentials') {
      userGithubAccessToken = await refreshAuthToken(userId);
    }

    const octokit = new Octokit({
      auth: userGithubAccessToken,
    });

    res = (await octokit.request(requestData)) as InstallationsResponse;
  }
  return res;
};
