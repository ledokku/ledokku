import { Queue, Worker } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { config } from '../config';
import { pubsub } from '..';
import { dokku } from '../lib/dokku';
import { sshConnect } from '../lib/ssh';

const queueName = 'rebuild-app';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appName: string;
}

export const rebuildAppQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisClient,
});

/**
 * - Restart app
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { appName } = job.data;

    debug(`starting rebuild app queue for ${appName} app`);

    const ssh = await sshConnect();
    const res = await dokku.process.restart(
      ssh,
      appName,

      {
        onStdout: (chunk) => {
          pubsub.publish('APP_REBUILT', {
            appRebuildLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          pubsub.publish('APP_REBUILT', {
            appRebuildLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    debug(`finishing rebuild app queue for ${appName} app`);
    if (!res.stderr) {
      pubsub.publish('APP_REBUILT', {
        appRebuildLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      pubsub.publish('APP_REBUILT', {
        appRebuildLogs: {
          message: 'Failed to rebuild app',
          type: 'end:failure',
        },
      });
    }
    ssh.dispose();
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName } = job.data;
  pubsub.publish('APP_REBUILT', {
    appRebuildLogs: {
      message: 'Failed to rebuild app',
      type: 'end:failure',
    },
  });
  debug(`${job.id} has failed for for ${appName} app  : ${err.message}`);
});
