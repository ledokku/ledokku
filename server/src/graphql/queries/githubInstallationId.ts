import { Octokit } from '@octokit/rest';
import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const githubInstallationId: QueryResolvers['githubInstallationId'] = async (
  _,
  {},
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  console.log(userId);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const octokit = new Octokit({
    auth: `${user.githubAccessToken}`,
  });

  const installations = await octokit.request('GET /user/installations');

  console.log(installations.data.installations[0]);

  const installationId = {
    id: installations.data.installations[0].id.toString(),
  };

  return installationId;
};
