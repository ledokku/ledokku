import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';
import { prisma } from '../prisma';

const queueName = 'restart-app';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appName: string;
}

export const restartAppQueue = new Queue<QueueArgs>(queueName, {
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

    debug(`starting restart-app queue for ${appName} app`);

    const ssh = await sshConnect();
    const res = await dokku.process.restart(
      ssh,
      appName,

      {
        onStdout: (chunk) => {
          pubsub.publish('APP_RESTARTED', {
            appRestartLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          pubsub.publish('APP_RESTARTED', {
            appRestartLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    debug(`finishing restart-app queue for ${appName} app`);
    if (!res.stderr) {
      pubsub.publish('APP_RESTARTED', {
        appRestartLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      pubsub.publish('APP_RESTARTED', {
        appRestartLogs: {
          message: 'Failed to restart app',
          type: 'end:failure',
        },
      });
    }
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName } = job.data;
  pubsub.publish('APP_RESTARTED', {
    appRestartLogs: {
      message: 'Failed restart app',
      type: 'end:failure',
    },
  });
  debug(`${job.id} has failed for for ${appName} app  : ${err.message}`);
});
