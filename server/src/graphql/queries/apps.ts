import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const apps: QueryResolvers['apps'] = async (
  _,
  __,
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const apps = await prisma.app.findMany({ where: { userId } });
  return apps;
};
