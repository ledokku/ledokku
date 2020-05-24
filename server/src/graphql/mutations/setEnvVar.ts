import { setEnvVarQueue } from '../../queues/setEnvVar';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const setEnvVar: MutationResolvers['setEnvVar'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { appId, key, value } = input;

  const app = await prisma.app.findOne({
    where: {
      id: appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  // We trigger the queue that will add env var to dokku
  await setEnvVarQueue.add('set-env-var', {
    appName: app.name,
    key,
    value,
  });

  return { result: true };
};
