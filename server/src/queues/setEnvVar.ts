import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';

const queueName = 'set-env-var';
const debug = createDebug(`queue:${queueName}`);

interface QueueArgs {
  appName: string;
  key: string;
  value: string;
}

export const setEnvVarQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: config.redisClient,
});

/**
 * - Set env vars
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { appName, key, value } = job.data;
    debug(`starting setEnvVarQueue for ${appName} with ${key}=${value}`);

    const ssh = await sshConnect();

    await dokku.config.set(ssh, appName, key, value);

    debug(`finished setEnvVarQueue for app:  ${appName} with ${key}=${value}`);
  },
  { connection: config.redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName, key, value } = job.data;

  debug(
    `${job.id} has failed for for app:  ${appName} with ${key}=${value}: ${err.message}`
  );
});
