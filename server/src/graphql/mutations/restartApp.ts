import { restartAppQueue } from '../../queues/restartApp';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const restartApp: MutationResolvers['restartApp'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { appId } = input;

  const app = await prisma.app.findOne({
    where: {
      id: appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  // We trigger the queue that will add env var to dokku
  await restartAppQueue.add('restart-app', {
    appName: app.name,
  });

  return { result: true };
};
