import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';
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

export const formatGithubPem = (pem: string) => {
  const githubAppPemSplit = pem.split('\n');
  const joinedPem = githubAppPemSplit.join('');
  const formattedStart = joinedPem.replace(
    '-----BEGIN RSA PRIVATE KEY-----',
    '-----BEGIN RSA PRIVATE KEY-----\n'
  );
  const formattedPem = formattedStart.replace(
    '-----END RSA PRIVATE KEY-----',
    '\n-----END RSA PRIVATE KEY-----'
  );

  return formattedPem;
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

  const octo = new Octokit({});

  const res = await octo.request(`POST /login/oauth/access_token`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      refresh_token: user.refreshToken,
      grant_type: 'refresh_token',
      client_id: config.githubAppClientId,
      client_secret: config.githubAppClientSecret,
    }),
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: res.data.refresh_token,
      refreshTokenExpiresAt: res.data.refresh_token_expires_in.toString(),
      githubAccessToken: res.data.access_token,
    },
  });
};

type InstallationParams = Endpoints['GET /user/installations'];
type InstallationsResponse = Endpoints['GET /user/installations']['response'];

export const octoRequestWithUserToken = async (
  requestData: InstallationParams['request'],
  userGithubAccessToken: string,
  userId: string
) => {
  const octokit = new Octokit({
    auth: userGithubAccessToken,
  });

  let res: InstallationsResponse;

  try {
    res = (await octokit.request(
      requestData as InstallationParams['request']
    )) as InstallationsResponse;
  } catch (e) {
    if (e.message === 'Bad credentials') {
      await refreshAuthToken(userId);
    }

    const octokit = new Octokit({
      auth: userGithubAccessToken,
    });

    res = (await octokit.request(requestData)) as InstallationsResponse;
  }
  return res;
};
