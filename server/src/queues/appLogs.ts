import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';

const queueName = 'app-realtime-logs';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appName: string;
}

export const appLogsQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisClient,
});

/**
 * - Create db
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { appName } = job.data;

    debug(`starting appLogs queue for ${appName} app`);

    const ssh = await sshConnect();

    const res = await ssh.execCommand(`logs ${appName} -t`, {
      onStdout: (chunk) => {
        console.log('CHUNK TO STRING NO ERR', chunk.toString());
        pubsub.publish('APP_REALTIME_LOGS', {
          appRealTimeLogs: {
            message: chunk.toString(),
            type: 'stdout',
          },
        });
      },
      onStderr: (chunk) => {
        console.log('CHUNK TO STRING ERR', chunk.toString());
        pubsub.publish('APP_REALTIME_LOGS', {
          appRealTimeLogs: {
            message: chunk.toString(),
            type: 'stderr',
          },
        });
      },
    });

    console.log('RES FROM QUEUE', res);

    debug(`finishing createDatabase queue for ${appName} app`);
    if (!res.stderr) {
      pubsub.publish('APP_REALTIME_LOGS', {
        appRealTimeLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      pubsub.publish('APP_REALTIME_LOGS', {
        appRealTimeLogs: {
          message: 'Failed to fetch app logs',
          type: 'end:failure',
        },
      });
    }
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName } = job.data;
  pubsub.publish('APP_REALTIME_LOGS', {
    appRealTimeLogs: {
      message: 'Failed to fetch app logs',
      type: 'end:failure',
    },
  });
  debug(`${job.id} has failed for for ${appName} app   : ${err.message}`);
});
