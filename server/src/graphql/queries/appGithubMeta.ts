import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const appMetaGithub: QueryResolvers['appMetaGithub'] = async (
  _,
  { appId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const appGithubMeta = await prisma.app
    .findUnique({
      where: { id: appId },
    })
    .AppMetaGithub();

  return appGithubMeta;
};
