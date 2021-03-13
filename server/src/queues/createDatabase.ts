import { dbTypeToDokkuPlugin } from './../graphql/utils';
import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import Redis from 'ioredis';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';
import { prisma } from '../prisma';

const queueName = 'create-database';
const debug = createDebug(`queue:${queueName}`);
const redisClient = new Redis(config.redisUrl);

interface QueueArgs {
  databaseName: string;
  databaseType: string;
  userId: string;
}

export const createDatabaseQueue = new Queue<QueueArgs>(queueName, {
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
    const { databaseName, databaseType } = job.data;

    const dbType = dbTypeToDokkuPlugin(databaseType);

    debug(
      `starting createDatabase queue for ${dbType} database called ${databaseName}`
    );

    const ssh = await sshConnect();
    const res = await dokku.database.create(
      ssh,
      databaseName,
      dbType,

      {
        onStdout: (chunk) => {
          pubsub.publish('DATABASE_CREATED', {
            createDatabaseLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          pubsub.publish('DATABASE_CREATED', {
            createDatabaseLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    const dokkuDatabaseVersion = await dokku.database.infoVersion(
      ssh,
      databaseName,
      dbType
    );

    const createdDb = await prisma.database.create({
      data: {
        name: databaseName,
        type: databaseType,
        version: dokkuDatabaseVersion,
      },
    });

    debug(
      `finishing createDatabase queue for ${dbType} database called ${databaseName}`
    );
    if (!res.stderr) {
      pubsub.publish('DATABASE_CREATED', {
        createDatabaseLogs: {
          message: createdDb.id,
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      pubsub.publish('DATABASE_CREATED', {
        createDatabaseLogs: {
          message: 'Failed to create db',
          type: 'end:failure',
        },
      });
    }
    ssh.dispose();
  },
  { connection: redisClient }
);

worker.on('failed', async (job, err) => {
  const { databaseType, databaseName } = job.data;
  pubsub.publish('DATABASE_CREATED', {
    createDatabaseLogs: {
      message: 'Failed to create DB',
      type: 'end:failure',
    },
  });
  debug(
    `${job.id} has failed for for ${databaseType} database ${databaseName}  : ${err.message}`
  );
});
