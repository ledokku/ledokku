import { Worker, Queue } from 'bullmq';
import NodeSsh from 'node-ssh';
import createDebug from 'debug';
import { config } from '../config';
import { io } from '../server';
import { prisma } from '../prisma';

const queueName = 'create-server';
const debug = createDebug(`queue:${queueName}`);

interface QueueArgs {
  actionId: string;
}

// TODO move it somewhere else
let url = config.redisUrl.split(':');
const connection = {
  host: url[1].replace('//', ''),
  port: +url[2],
};

export const createServerQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
    // We wait 1 minute to start the job so the server have time to finish to boot properly
    // TODO for now delay is not working, when we add any delay the job is never picked up. Add it back once the bug is fixed
    // delay: 60000,
    // Max timeout 20 minutes
    timeout: 1.2e6,
  },
  connection,
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

    const onStdout = (chunk: Buffer) => {
      const message = chunk.toString('utf8');
      io.emit(`create-server:${server.id}`, { message, type: 'stdout' });
      debug(`stdoutChunk: ${message}`);
    };

    const onStderr = (chunk: Buffer) => {
      const message = chunk.toString('utf8');
      io.emit(`create-server:${server.id}`, { message, type: 'stderr' });
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

    const wgetCommand =
      'wget https://raw.githubusercontent.com/dokku/dokku/v0.20.3/bootstrap.sh';
    io.emit(`create-server:${server.id}`, {
      message: wgetCommand,
      type: 'command',
    });
    // Then we install dokku on the new server
    const resultWget = await ssh.execCommand(wgetCommand, {
      onStdout,
      onStderr,
    });
    debug('resultWget', resultWget);

    const dokkuBootstrapCommand = 'DOKKU_TAG=v0.20.3 bash bootstrap.sh';
    io.emit(`create-server:${server.id}`, {
      message: dokkuBootstrapCommand,
      type: 'command',
    });
    // Then we install dokku on the new server
    const resultDokkuBootstrap = await ssh.execCommand(dokkuBootstrapCommand, {
      onStdout,
      onStderr,
    });
    debug('resultDokkuBootstrap', resultDokkuBootstrap);

    const dokkuClone =
      'dokku plugin:install https://github.com/crisward/dokku-clone.git clone';
    io.emit(`create-server:${server.id}`, {
      message: dokkuClone,
      type: 'command',
    });
    // Now we can install redis
    const resultDokkuClone = await ssh.execCommand(dokkuClone, {
      onStdout,
      onStderr,
    });
    debug('resultDokkuClone', resultDokkuClone);

    await prisma.action.update({
      where: { id: action.id },
      data: {
        status: 'COMPLETED',
      },
    });
    debug(`finished createServerQueue for server id ${server.id}`);

    // TODO notify client via socket.io that job is finished
  },
  { connection }
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
