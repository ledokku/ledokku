import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';

const queueName = 'deploy-app';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appName: string;
  gitRepoUrl: string;
  branchName?: string;
  dokkuApp?: boolean;
  appId?: string;
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
    const { appName, gitRepoUrl, appId, branchName } = job.data;

    debug(
      `starting deploy app queue for ${appName} app with repoURL ${gitRepoUrl} and branch name ${branchName}`
    );

    const branch = branchName ? branchName : 'main';

    const ssh = await sshConnect();

    await dokku.git.unlock(ssh, appName);

    if (gitRepoUrl) {
      const res = await dokku.git.sync({
        ssh,
        appName,
        gitRepoUrl,
        branchName: branch,
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
      debug(`finishing create app ${appName} from ${gitRepoUrl}`);
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
