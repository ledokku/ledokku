import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { QueryResolvers } from '../../generated/graphql';
import { config } from '../../config';
import { prisma } from '../../prisma';
export const repositories: QueryResolvers['repositories'] = async (
  _,
  { installationId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const auth = createAppAuth({
    appId: config.githubAppId,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
KEY HERE
-----END RSA PRIVATE KEY-----`,
    clientId: config.githubAppClientSecret,
    clientSecret: config.githubAppClientSecret,
  });

  const installationAuthentication = await auth({
    type: 'installation',
    installationId,
  });

  const octo = new Octokit({
    //@ts-ignore
    auth: installationAuthentication.token,
  });

  const repos = await octo.request('GET /installation/repositories');

  const repositories = [];

  repos.data.repositories.map((r) => {
    const repoToPush = {
      id: r.id,
      name: r.name,
      full_name: r.full_name,
      private: r.private,
    };

    repositories.push(repoToPush);
  });

  return repositories;
};
