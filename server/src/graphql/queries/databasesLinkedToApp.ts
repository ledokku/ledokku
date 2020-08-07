import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const databasesLinkedToApp: QueryResolvers['databasesLinkedToApp'] = async (
  _,
  { appId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const app = await prisma.app.findOne({
    where: {
      id: appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  const databases = await prisma.app
    .findOne({
      where: {
        id: appId,
      },
      select: {
        databases: true,
      },
    })
    .databases();

  return { databases };
};
