import { rebuildAppQueue } from './../../queues/rebuildApp';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const rebuildApp: MutationResolvers['rebuildApp'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { appId } = input;

  const app = await prisma.app.findUnique({
    where: {
      id: appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  // We trigger the queue that will add env var to dokku
  await rebuildAppQueue.add('rebuild-app', {
    appName: app.name,
  });

  return { result: true };
};
