import { dbTypeToDokkuPlugin } from './../graphql/utils';
import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import { pubsub } from './../index';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { prisma } from '../prisma';

const queueName = 'create-database';
const debug = createDebug(`queue:${queueName}`);

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
  connection: config.redisClient,
});

/**
 * - Create db
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { databaseName, databaseType, userId } = job.data;

    const dbType = dbTypeToDokkuPlugin(databaseType);

    debug(
      `starting createDatabase queue for ${dbType} database called ${databaseName}`
    );

    const ssh = await sshConnect();
    const res = await ssh.execCommand(`${dbType}:create ${databaseName}`, {
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
    });

    await prisma.database.create({
      data: {
        name: databaseName,
        type: databaseType,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    debug(
      `finishing createDatabase queue for ${dbType} database called ${databaseName}`
    );
    if (!res.stderr) {
      pubsub.publish('DATABASE_CREATED', {
        createDatabaseLogs: {
          message: 'Successfully created DB',
          type: 'end',
        },
      });
    } else if (res.stderr) {
      pubsub.publish('DATABASE_CREATED', {
        createDatabaseLogs: {
          message: 'Failed to create DB',
          type: 'end',
        },
      });
    }
  },
  { connection: config.redisClient }
);

worker.on('failed', async (job, err) => {
  const { databaseType, databaseName } = job.data;
  pubsub.publish('DATABASE_CREATED', {
    createDatabaseLogs: {
      message: 'Failed to create DB',
      type: 'end',
    },
  });
  debug(
    `${job.id} has failed for for ${databaseType} database ${databaseName}  : ${err.message}`
  );
});
