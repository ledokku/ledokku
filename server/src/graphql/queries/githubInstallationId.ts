import { Octokit } from '@octokit/rest';
import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const githubInstallationId: QueryResolvers['githubInstallationId'] = async (
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

  const octokit = new Octokit({
    auth: user.githubAccessToken,
  });

  const installations = await octokit.request('GET /user/installations');

  const installationId = {
    id: installations.data.installations[0].id.toString(),
  };

  return installationId;
};
