import { dbTypeToDokkuPlugin } from './../graphql/utils';

import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import { pubsub } from './../index';

import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { prisma } from '../prisma';

const queueName = 'unlink-database';
const debug = createDebug(`queue:${queueName}`);

interface QueueArgs {
  appId: string;
  databaseId: string;
}

export const unlinkDatabaseQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: config.redisClient,
});

/**
 * - Unlink db
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { appId, databaseId } = job.data;
    const app = await prisma.app.findOne({
      where: {
        id: appId,
      },
    });

    const database = await prisma.database.findOne({
      where: {
        id: databaseId,
      },
    });

    debug(
      `starting unlinkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );

    const dbType = dbTypeToDokkuPlugin(database.type);

    const ssh = await sshConnect();

    const res = await ssh.execCommand(
      `${dbType}:unlink ${database.name} ${app.name}`
    );

    const arrayOfLogs = res.stdout.split('\n');

    pubsub.publish('DATABASE_UNLINKED', { unlinkDatabaseLogs: arrayOfLogs });

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
  },
  { connection: config.redisClient }
);

worker.on('failed', async (job, err) => {
  const { app, database } = job.data;

  debug(
    `${job.id} has failed for for ${database.type} database ${database.name} and ${app.name} : ${err.message}`
  );
});
