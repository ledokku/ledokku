import { AppAuthentication } from '@octokit/auth-app/dist-types/types';
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
    privateKey: config.githubAppPem,
    clientId: config.githubAppClientSecret,
    clientSecret: config.githubAppClientSecret,
  });

  const installationAuthentication = (await auth({
    type: 'installation',
    installationId,
  })) as AppAuthentication;

  const octo = new Octokit({
    auth: installationAuthentication.token,
  });

  const fetchedBranches = await octo.request(
    `GET /repos/${user.username}/${repositoryName}/branches`
  );

  const branches = fetchedBranches.data.map((b) => {
    const branchToPush = {
      name: b.name,
    };

    return branchToPush;
  });

  return branches;
};
