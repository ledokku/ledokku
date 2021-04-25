import { Octokit } from '@octokit/rest';
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
      refreshTokenExpiresIn: true,
      githubAccessToken: true,
    },
  });

  let data;

  const octo = new Octokit({});

  try {
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

    data = res;
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: data.refresh_token,
        refreshTokenExpiresIn: data.refresh_token_expires_in.toString(),
        githubAccessToken: data.access_token,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Request failed');
  }
};

export const octoRequestWithUserToken = async (
  requestData: string,
  userGithubAccessToken: string,
  userId: string
) => {
  let res;

  const octokit = new Octokit({
    auth: userGithubAccessToken,
  });

  try {
    res = await octokit.request(requestData);
  } catch (e) {
    if (e.message === 'Bad credentials') {
      await refreshAuthToken(userId);
    }

    const octokit = new Octokit({
      auth: userGithubAccessToken,
    });

    res = await octokit.request(requestData);

    return res;
  }
};
