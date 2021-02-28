import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { unsetEnvVarQueue } from './../../queues/unsetEnvVar';

export const unsetEnvVar: MutationResolvers['unsetEnvVar'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { appId, key } = input;

  const app = await prisma.app.findUnique({
    where: {
      id: appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  // We trigger the queue that will unset env var to dokku
  await unsetEnvVarQueue.add('unset-env-var', {
    appName: app.name,
    key,
  });

  return { result: true };
};
