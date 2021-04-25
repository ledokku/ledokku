import { refreshAuthToken } from './../utils';
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

  let installations;

  try {
    installations = await octokit.request('GET /user/installations');
  } catch (e) {
    if (e.message === 'Bad credentials') {
      await refreshAuthToken(userId);

      const octokit = new Octokit({
        auth: user.githubAccessToken,
      });

      installations = await octokit.request('GET /user/installations');
    }
  }

  const installationId = {
    id: installations.data.installations[0].id.toString(),
  };

  return installationId;
};
