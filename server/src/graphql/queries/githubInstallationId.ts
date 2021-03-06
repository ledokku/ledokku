import { octoRequestWithUserToken } from './../utils';
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

  const installations = await octoRequestWithUserToken(
    'GET /user/installations',
    // @TODO fix types, related issue : https://github.com/ledokku/ledokku/issues/371
    // {
    //   method: 'GET',
    //   url: '/user/installations',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   },
    //   request: {},
    // },
    user.githubAccessToken,
    userId
  );

  const installationId = {
    id: installations.data.installations[0].id.toString(),
  };

  return installationId;
};
