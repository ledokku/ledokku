import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const databases: QueryResolvers['databases'] = async (
  _,
  __,
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const databases = await prisma.database.findMany();
  return databases;
};
