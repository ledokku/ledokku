import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const app: QueryResolvers['app'] = async (_, { appId }, { userId }) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const app = await prisma.app.findUnique({
    where: { id: appId },
  });

  return app;
};
