import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const isDatabaseLinked: QueryResolvers['isDatabaseLinked'] = async (
  _,
  { databaseId, appId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }
  // We query for link between particular db and particular app
  const linkedApps = await prisma.database
    .findOne({
      where: {
        id: databaseId,
      },
      select: {
        apps: {
          where: {
            id: appId,
          },
        },
      },
    })
    .apps();

  const isLinked = linkedApps.length === 1;

  return { isLinked };
};
