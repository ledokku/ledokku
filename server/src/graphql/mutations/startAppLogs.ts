import { appLogsQueue } from './../../queues/appLogs';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const startAppLogs: MutationResolvers['startAppLogs'] = async (
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

  console.log(`STARTING MUTATION FOR APP ${app.name}`);

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  // We trigger the queue that will start the app-real-time-logs-queue
  const queue = await appLogsQueue.add('app-realtime-logs', {
    appName: app.name,
  });

  console.log('QUEUE ID FROM MUTATION', queue.id);

  return {
    realtimeAppLogsStarted: true,
    queueId: queue.id,
  };
};
