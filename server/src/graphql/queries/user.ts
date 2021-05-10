import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const user: QueryResolvers['user'] = async (_, __, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findMany();
  return { userName: user[0].username };
};
