import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import execa from 'execa';
import { config } from '../config';
import { sshConnect } from '../lib/ssh';
import { dokku } from '../lib/dokku';
import { io } from '../server';

const queueName = 'unlink-database';
const debug = createDebug(`queue:${queueName}`);

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

interface QueueArgs {
  appName: string;
  databaseName: string;
  databaseType: string;
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
    const { appName, databaseName, databaseType } = job.data;
    debug(
      `starting unlinkDatabaseQueue for ${databaseType} database ${databaseName} from  ${appName} app`
    );
    console.log(
      `starting unlinkDatabaseQueue for ${databaseType} database ${databaseName} from  ${appName} app`
    );

    let logs: RealtimeLog[] = [];
    let logTimerId: any;
    const sendLogs = (log: RealtimeLog) => {
      logs.push(log);
      clearTimeout(logTimerId);
      logTimerId = setTimeout(() => {
        console.log(logs);
        io.emit(`hello`, logs);
        logs = [];
      }, 500);
    };

    const ssh = await sshConnect();

    const res = await ssh.execCommand(
      `${databaseType}:unlink ${databaseName} ${appName}`
    );

    console.log('res stdout', res.stdout);
    sendLogs({ message: res.stdout, type: 'stdout' });

    console.log(
      `finishing unlinkDatabaseQueue for ${databaseType} database ${databaseName} from  ${appName} app`
    );
    debug(
      `finishing unlinkDatabaseQueue for ${databaseType} database ${databaseName} from  ${appName} app`
    );
  },
  { connection: config.redisClient }
);

worker.on('failed', async (job, err) => {
  const { appName, databaseName, databaseType } = job.data;

  debug(
    `${job.id} has failed for for ${databaseType} database ${databaseName} and ${appName} : ${err.message}`
  );
});
