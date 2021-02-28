import { dbTypeToDokkuPlugin } from './../graphql/utils';
import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';
import { prisma } from '../prisma';

const queueName = 'link-database';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  appId: string;
  databaseId: string;
}

export const linkDatabaseQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisClient,
});

/**
 * - Link db
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
      `starting linkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );

    const dbType = dbTypeToDokkuPlugin(database.type);

    const ssh = await sshConnect();
    const res = await dokku.database.link(
      ssh,
      database.name,
      dbType,
      app.name,
      {
        onStdout: (chunk) => {
          pubsub.publish('DATABASE_LINKED', {
            linkDatabaseLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          pubsub.publish('DATABASE_LINKED', {
            linkkDatabaseLogs: {
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
          connect: { id: app.id },
        },
      },
    });

    debug(
      `finishing linkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );
    if (!res.stderr) {
      pubsub.publish('DATABASE_LINKED', {
        linkDatabaseLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      pubsub.publish('DATABASE_LINKED', {
        linkDatabaseLogs: {
          message: '',
          type: 'end:failure',
        },
      });
    }
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { app, database } = job.data;

  debug(
    `${job.id} has failed for for ${database.type} database ${database.name} and ${app.name} : ${err.message}`
  );
});
