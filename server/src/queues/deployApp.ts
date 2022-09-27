import { Queue, Worker } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { config } from '../config';
import { pubsub } from '..';
import { dokku } from '../lib/dokku';
import { sshConnect } from '../lib/ssh';
import { prisma } from '../prisma';

const queueName = 'deploy-app';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appId: string;
  userName: string;
  token: string;
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
    const { appId, userName, token } = job.data;

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

    const { branch, repoName, repoOwner } = appMetaGithub;

    const branchName = branch ? branch : 'main';

    const ssh = await sshConnect();

    await dokku.git.auth({
      ssh,
      username: userName,
      token,
    });

    await dokku.git.unlock(ssh, app.name);

    const res = await dokku.git.sync({
      ssh,
      appName: app.name,
      gitRepoUrl: `https://github.com/${repoOwner}/${repoName}.git`,
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
    debug(
      `finishing create app ${app.name} from https://github.com/${repoOwner}/${repoName}.git`
    );
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
