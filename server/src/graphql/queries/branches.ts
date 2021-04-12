import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
import { QueryResolvers } from '../../generated/graphql';
import { config } from '../../config';
import { prisma } from '../../prisma';
export const branches: QueryResolvers['branches'] = async (
  _,
  { repositoryName, installationId },
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

  const fetchedBranches = await octo.request(
    `GET /repos/${user.username}/${repositoryName}/branches`
  );

  const branches = [];

  fetchedBranches.data.map((b) => {
    const branchToPush = {
      name: b.name,
    };

    branches.push(branchToPush);
  });

  return branches;
};
