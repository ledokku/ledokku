import { Worker, Queue } from 'bullmq';
import NodeSsh from 'node-ssh';
import createDebug from 'debug';
import { redisConnection } from '../config';
import { io } from '../server';
import { prisma } from '../prisma';

const queueName = 'create-server';
const debug = createDebug(`queue:${queueName}`);

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

interface QueueArgs {
  actionId: string;
}

export const createServerQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // We wait 1 minute to start the job so the server have time to finish to boot properly
    // TODO for now delay is not working, when we add any delay the job is never picked up. Add it back once the bug is fixed
    // delay: 60000,
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection: redisConnection,
});

/**
 * - Install dokku on the server
 */
const worker = new Worker(
  queueName,
  async (job) => {
    const { actionId } = job.data;
    debug(`starting createServerQueue for action id ${actionId}`);

    const action = await prisma.action.findOne({
      where: { id: actionId },
      select: {
        id: true,
        server: {
          select: {
            id: true,
            ip: true,
            sshKey: { select: { id: true, privateKey: true } },
          },
        },
      },
    });
    if (!action) {
      throw new Error(`Action ${actionId} not found for job ${job.id}`);
    }
    const server = action.server;

    await prisma.action.update({
      where: { id: action.id },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    // We send multiple logs at once to not spam the client
    let logs: RealtimeLog[] = [];
    let logTimerId: number;
    const sendLogs = (log: RealtimeLog) => {
      logs.push(log);
      clearTimeout(logTimerId);
      logTimerId = setTimeout(() => {
        io.emit(`create-server:${server.id}`, logs);
        logs = [];
      }, 500);
    };

    const onStdout = (chunk: Buffer) => {
      const message = chunk.toString('utf8');
      sendLogs({ message, type: 'stdout' });
      debug(`stdoutChunk: ${message}`);
    };

    const onStderr = (chunk: Buffer) => {
      const message = chunk.toString('utf8');
      sendLogs({ message, type: 'stderr' });
      debug(`stderrChunk ${message}`);
    };

    const ssh = new NodeSsh();

    debug(`connecting to ${server.ip}`);
    // First we setup a connection to the server
    await ssh.connect({
      host: server.ip,
      // TODO create separate user
      username: 'root',
      privateKey: server.sshKey.privateKey,
    });
    debug(`connected to ${server.ip}`);

    const execCommand = async (command: string) => {
      debug('execCommand', command);
      io.emit(`create-server:${server.id}`, [
        {
          message: command,
          type: 'command',
        },
      ]);
      const resultCommand = await ssh.execCommand(command, {
        onStdout,
        onStderr,
      });
      debug('resultCommand', resultCommand);
    };

    // TODO find a way to get the latest available release
    await execCommand(
      'wget https://raw.githubusercontent.com/dokku/dokku/v0.20.3/bootstrap.sh'
    );
    await execCommand('DOKKU_TAG=v0.20.3 bash bootstrap.sh');

    await prisma.action.update({
      where: { id: action.id },
      data: {
        status: 'COMPLETED',
      },
    });
    await prisma.server.update({
      where: {
        id: server.id,
      },
      data: {
        status: 'ACTIVE',
      },
    });
    debug(`finished createServerQueue for server id ${server.id}`);

    // TODO notify client via socket.io that job is finished
  },
  { connection: redisConnection }
);

worker.on('failed', async (job, err) => {
  const { actionId } = job.data;
  // TODO save err.message to show it to the end user
  await prisma.action.update({
    where: { id: actionId },
    data: {
      status: 'ERRORED',
    },
  });
  debug(`${job.id} has failed for action ${actionId}: ${err.message}`);
});
