import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';

const queueName = 'unset-env-var';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appName: string;
  key: string;
}

export const unsetEnvVarQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisClient,
});

/**
 * - Set env vars
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { appName, key } = job.data;
    debug(`starting unsetEnvVarQueue for ${appName} with ${key}`);

    const ssh = await sshConnect();

    await dokku.config.unset(ssh, appName, key);

    debug(`finished unsetEnvVarQueue for app:  ${appName} with ${key}`);
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName, key, value } = job.data;

  debug(
    `${job.id} has failed for for app:  ${appName} with ${key}: ${err.message}`
  );
});
