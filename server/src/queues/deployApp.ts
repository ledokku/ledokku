import { Queue, Worker } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { container } from 'tsyringe';
import { config } from '../config';
import { DokkuGitRepository } from './../lib/dokku/dokku.git.repository';
import { AppCreatedPayload } from './../modules/apps/data/models/app_created.payload';

import { pubsub } from '../index.old';
import { sshConnect } from '../lib/ssh';
import { prisma } from '../prisma';

const queueName = 'deploy-app';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);
const dokkuGit = container.resolve(DokkuGitRepository);

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

    await dokkuGit.auth(ssh, userName, token);

    await dokkuGit.unlock(ssh, app.name);

    const res = await dokkuGit.sync(
      ssh,
      app.name,
      `https://github.com/${repoOwner}/${repoName}.git`,
      branchName,
      {
        onStdout: (chunk) => {
          pubsub.publish('APP_CREATED', <AppCreatedPayload>{
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
