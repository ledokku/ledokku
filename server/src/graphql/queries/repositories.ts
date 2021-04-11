import { Repository } from './../../generated/graphql';
import fetch from 'node-fetch';
import { QueryResolvers } from '../../generated/graphql';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../../config';
import { prisma } from '../../prisma';
export const repositories: QueryResolvers['repositories'] = async (
  _,
  __,
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const payload = {
    iat: Math.round(new Date().getTime() / 1000),
    exp: Math.round(new Date().getTime() / 1000 + 60),
    iss:
      process.env.NODE_ENV === 'production'
        ? config.githubAppId
        : process.env.GITHUB_APP__ID,
  };

  //TODO FIGURE OUT A WAY TO PARSE THE PEM PROPERLY
  const token = jsonwebtoken.sign(
    payload,
    `-----BEGIN RSA PRIVATE KEY-----
---- KEY
-----END RSA PRIVATE KEY-----`,
    {
      algorithm: 'RS256',
    }
  );
  const authAsInstallation = await fetch(
    `https://api.github.com/app/installations/${
      process.env.NODE_ENV === 'production'
        ? config.githubAppInstallationId
        : process.env.GITHUB_APP_INSTALLATION_ID
    }/access_tokens`,
    {
      headers: {
        Accept: 'application/vnd.github.machine-man-preview+json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    }
  );
  const data = await authAsInstallation.json();
  console.log(data);
  const responseRepos = await fetch(
    'https://api.github.com/installation/repositories',
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${data.token}`,
      },
    }
  );

  const fetchedRepos = await responseRepos.json();

  let repositories = [];
  let branches = [];

  const map = fetchedRepos.repositories.map(async (r) => {
    const responseBranches = await fetch(
      `https://api.github.com/repos/${user.username}/${r.name}/branches`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `token ${data.token}`,
        },
      }
    );

    const fetchedBranches = await responseBranches.json();

    fetchedBranches.map((b) => {
      branches.push(b.name);
    });

    const repoToPush = {
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      private: r.private,
      branches,
    };

    return repoToPush;
  });

  for await (let repoToPush of map) {
    repositories.push(repoToPush);
  }

  console.log('repos outside', repositories);

  return repositories;
};
