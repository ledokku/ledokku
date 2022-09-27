import { Queue, Worker } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { config } from '../config';
import { pubsub } from '..';
import { dokku } from '../lib/dokku';
import { sshConnect } from '../lib/ssh';
import { prisma } from '../prisma';
import { dbTypeToDokkuPlugin } from './../graphql/utils';

const queueName = 'unlink-database';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appId: string;
  databaseId: string;
}

export const unlinkDatabaseQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisClient,
});

/**
 * - Unlink db
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { appId, databaseId } = job.data;
    const app = await prisma.app.findUnique({
      where: {
        id: appId,
      },
    });

    const database = await prisma.database.findUnique({
      where: {
        id: databaseId,
      },
    });

    debug(
      `starting unlinkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );

    const dbType = dbTypeToDokkuPlugin(database.type);

    const ssh = await sshConnect();
    const res = await dokku.database.unlink(
      ssh,
      database.name,
      dbType,
      app.name,
      {
        onStdout: (chunk) => {
          pubsub.publish('DATABASE_UNLINKED', {
            unlinkDatabaseLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          pubsub.publish('DATABASE_UNLINKED', {
            unlinkDatabaseLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    await prisma.database.update({
      where: { id: database.id },
      data: {
        apps: {
          disconnect: { id: app.id },
        },
      },
    });

    debug(
      `finishing unlinkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );
    if (!res.stderr) {
      pubsub.publish('DATABASE_UNLINKED', {
        unlinkDatabaseLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      pubsub.publish('DATABASE_UNLINKED', {
        unlinkDatabaseLogs: {
          message: '',
          type: 'end:failure',
        },
      });
    }
    ssh.dispose();
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { app, database } = job.data;

  debug(
    `${job.id} has failed for for ${database.type} database ${database.name} and ${app.name} : ${err.message}`
  );
});
