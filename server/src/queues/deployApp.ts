import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';
import { prisma } from '../prisma';

const queueName = 'deploy-app';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appId: string;
}

export const deployAppQueue = new Queue<QueueArgs>(queueName, {
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
    const { appId } = job.data;

    debug(`starting deploy app queue for ${appId} app`);

    const app = await prisma.app.findUnique({
      where: {
        id: appId,
      },
    });

    const appMetaGithub = await prisma.app
      .findUnique({
        where: {
          id: appId,
        },
      })
      .AppMetaGithub();

    const { branch, repoUrl } = appMetaGithub;

    const branchName = branch ? branch : 'main';

    const ssh = await sshConnect();

    await dokku.git.unlock(ssh, app.name);

    const res = await dokku.git.sync({
      ssh,
      appName: app.name,
      gitRepoUrl: repoUrl,
      branchName,
      options: {
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
      },
    });
    debug(`finishing create app ${app.name} from ${repoUrl}`);
    if (!res.stderr) {
      pubsub.publish('APP_CREATED', {
        appCreateLogs: {
          message: appId,
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
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { appId } = job.data;
  pubsub.publish('APP_CREATED', {
    appCreateLogs: {
      message: 'Failed to create an app',
      type: 'end:failure',
    },
  });
  debug(`${job.id} has failed for for ${appId}   : ${err.message}`);
});
