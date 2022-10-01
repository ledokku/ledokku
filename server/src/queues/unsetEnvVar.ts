import { Queue, Worker } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { container } from 'tsyringe';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { DokkuAppRepository } from './../lib/dokku/dokku.app.repository';

const queueName = 'unset-env-var';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);
const dokkuApp = container.resolve(DokkuAppRepository);

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

    await dokkuApp.unsetEnvVar(ssh, appName, key);

    debug(`finished unsetEnvVarQueue for app:  ${appName} with ${key}`);
    ssh.dispose();
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName, key } = job.data;

  debug(
    `${job.id} has failed for for app:  ${appName} with ${key}: ${err.message}`
  );
});
