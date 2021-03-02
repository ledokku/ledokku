import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const database: QueryResolvers['database'] = async (
  _,
  { databaseId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const database = await prisma.database.findUnique({
    where: { id: databaseId },
  });

  return database;
};
