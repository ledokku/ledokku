import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const servers: QueryResolvers['servers'] = async (_, __, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const servers = await prisma.server.findMany({
    where: { userId },
  });
  return servers;
};
