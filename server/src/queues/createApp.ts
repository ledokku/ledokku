import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';
import { prisma } from '../prisma';

const queueName = 'create-app';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appName: string;
  gitRepoUrl: string;
  userId: string;
  branchName?: string;
}

export const createAppQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisClient,
});

/**
 * - Create app
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { appName, gitRepoUrl, userId, branchName } = job.data;

    debug(
      `starting create app queue for ${userId} and ${appName} app with repoURL ${gitRepoUrl} and branch name ${branchName}`
    );

    const branch = branchName ? branchName : 'main';

    const ssh = await sshConnect();

    const dokkuApp = await dokku.apps.create(ssh, appName);

    const app = await prisma.app.create({
      data: {
        name: appName,
      },
    });

    if (dokkuApp && gitRepoUrl) {
      const res = await dokku.git.sync(
        ssh,
        appName,
        gitRepoUrl,
        branch,

        {
          onStdout: (chunk) => {
            pubsub.publish('APP_CREATED', {
              appCreateLogs: {
                message: chunk.toString(),
                type: 'stdout',
              },
            });
          },
          onStderr: (chunk) => {
            pubsub.publish('APP_CREATED', {
              appCreateLogs: {
                message: chunk.toString(),
                type: 'stderr',
              },
            });
          },
        }
      );
      debug(`finishing create app ${appName} from ${gitRepoUrl}`);
      if (!res.stderr) {
        pubsub.publish('APP_CREATED', {
          appCreateLogs: {
            message: app.id,
            type: 'end:success',
          },
        });
      } else if (res.stderr) {
        pubsub.publish('APP_CREATED', {
          appCreateLogs: {
            message: 'Failed to create app',
            type: 'end:failure',
          },
        });
      }
    }
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName, gitRepoUrl } = job.data;
  pubsub.publish('APP_CREATED', {
    appCreateLogs: {
      message: 'Failed to create an app',
      type: 'end:failure',
    },
  });
  debug(
    `${job.id} has failed for for ${appName} app from ${gitRepoUrl}  : ${err.message}`
  );
});
