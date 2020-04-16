import Queue from 'bull';
import NodeSsh from 'node-ssh';
import createDebug from 'debug';
import { config } from '../config';
import { io } from '../server';
import { prisma } from '../prisma';

const debug = createDebug('queue:create-server');

/**
 * - Install dokku on the server
 * - Install postgres plugin
 * - Install redis plugin
 */
export const createServerQueue = new Queue<{ actionId: string }>(
  'create server queue',
  {
    redis: config.redisUrl,
    defaultJobOptions: {
      // Max timeout 20 minutes
      timeout: 1.2e6,
    },
  }
);

// TODO on error update the action object
createServerQueue.process(async (job) => {
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
  try {
    await ssh.connect({
      host: server.ip,
      // TODO create separate user
      username: 'root',
      privateKey: server.sshKey.privateKey,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to connect via ssh');
  }

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

  const dokkuPostgres =
    'dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres';
  io.emit(`create-server:${server.id}`, {
    message: dokkuPostgres,
    type: 'command',
  });
  // Now we can install postgres
  const resultDokkuPostgres = await ssh.execCommand(dokkuPostgres, {
    onStdout,
    onStderr,
  });
  debug('resultDokkuPostgres', resultDokkuPostgres);

  const dokkuRedis =
    'dokku plugin:install https://github.com/dokku/dokku-redis.git redis';
  io.emit(`create-server:${server.id}`, {
    message: dokkuRedis,
    type: 'command',
  });
  // Now we can install redis
  const resultDokkuRedis = await ssh.execCommand(dokkuRedis, {
    onStdout,
    onStderr,
  });
  debug('resultDokkuRedis', resultDokkuRedis);

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
});

createServerQueue.on('error', (error) => {
  console.error(error);
});
