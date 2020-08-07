import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const appsLinkedToDatabase: QueryResolvers['appsLinkedToDatabase'] = async (
  _,
  { databaseId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const database = await prisma.database.findOne({
    where: {
      id: databaseId,
    },
  });

  if (!databaseId) {
    throw new Error(`Database with ID ${databaseId} not found`);
  }

  const apps = await prisma.database
    .findOne({
      where: {
        id: databaseId,
      },
      select: {
        apps: true,
      },
    })
    .apps();

  return { apps };
};
