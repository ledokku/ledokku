import { dbTypeToDokkuPlugin } from './../graphql/utils';
import { Database, App } from '../generated/graphql';
import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import { pubsub } from './../index';

import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { prisma } from '../prisma';

const queueName = 'unlink-database';
const debug = createDebug(`queue:${queueName}`);

interface QueueArgs {
  app: App;
  database: Database;
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
    const { app, database } = job.data;
    debug(
      `starting unlinkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );
    console.log(
      `starting unlinkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );

    const dbType = dbTypeToDokkuPlugin(database.type);

    const ssh = await sshConnect();

    const res = await ssh.execCommand(
      `${dbType}:unlink ${database.name} ${app.name}`
    );

    const arrayOfLogs = res.stdout.split('\n');

    arrayOfLogs.forEach((log) => {
      pubsub.publish('DATABASE_UNLINKED', {
        unlinkDatabaseLogs: [log],
      });
    });

    console.log('res stdout', res.stdout);

    await prisma.database.update({
      where: { id: database.id },
      data: {
        apps: {
          disconnect: { id: app.id },
        },
      },
    });

    console.log(
      `finishing unlinkDatabaseQueue for ${database.type} database ${database.name} from  ${app.name} app`
    );
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
