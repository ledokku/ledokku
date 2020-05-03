import { Worker, Queue } from 'bullmq';
import NodeSsh from 'node-ssh';
import createDebug from 'debug';
import { redisConnection } from '../config';
import { io } from '../server';
import { prisma } from '../prisma';
import { dokku } from '../lib/dokku';

const queueName = 'build-app';
const debug = createDebug(`queue:${queueName}`);

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

interface QueueArgs {
  buildId: string;
}

export const buildAppQueue = new Queue<QueueArgs>(queueName, {
  defaultJobOptions: {
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
    const { buildId } = job.data;
    debug(`starting buildAppQueue for build id ${buildId}`);

    const appBuild = await prisma.appBuild.findOne({
      where: { id: buildId },
      select: {
        id: true,
        server: {
          select: {
            id: true,
            ip: true,
            sshKey: { select: { id: true, privateKey: true } },
          },
        },
        app: {
          select: {
            id: true,
            name: true,
            githubRepoUrl: true,
          },
        },
      },
    });
    if (!appBuild) {
      throw new Error(`App build ${buildId} not found for job ${job.id}`);
    }

    const server = appBuild.server;
    const app = appBuild.app;
    await prisma.appBuild.update({
      where: { id: appBuild.id },
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
        io.emit(`app-build:${appBuild.id}`, logs);
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

    const execCommand = async (
      command: string,
      options: { cwd?: string } = {}
    ) => {
      debug('execCommand', command);
      io.emit(`app-build:${appBuild.id}`, [
        {
          message: command,
          type: 'command',
        },
      ]);
      const resultCommand = await ssh.execCommand(command, {
        onStdout,
        onStderr,
        cwd: options.cwd,
      });
      debug('resultCommand', resultCommand);
      return resultCommand;
    };

    // TODO only if folder does not exist clone
    // TODO otherwise git pull first

    // If server does not have any ssh key we first create a new one to be able to deploy the app
    const resultTest = await execCommand('test -e /root/.ssh/id_rsa');
    if (resultTest.code === 1) {
      // First is to generate a deploy ssh key
      // TODO set a password for better security?
      await execCommand('ssh-keygen -t rsa -f /root/.ssh/id_rsa -N ""');

      // Then we add the key to the list of allowed key
      await execCommand('dokku ssh-keys:add ledokku /root/.ssh/id_rsa.pub');

      // We whitelist the ip into the known hosts
      await execCommand(`ssh-keyscan ${server.ip} >> ~/.ssh/known_hosts`);
    }

    // First step is to clone the github repo
    await execCommand(
      `git clone ${app.githubRepoUrl} /home/ledokku-repos/${app.name}`
    );

    // Then we add the dokku remote that will trigger the build steps every time you commit
    await execCommand(`git remote add dokku dokku@${server.ip}:${app.name}`, {
      cwd: `/home/ledokku-repos/${app.name}`,
    });

    // Finally we push
    await execCommand('git push -f dokku master', {
      cwd: `/home/ledokku-repos/${app.name}`,
    });

    await prisma.appBuild.update({
      where: { id: appBuild.id },
      data: {
        status: 'COMPLETED',
      },
    });

    debug(`finished buildAppQueue for app id ${app.id}`);
    // TODO notify client via socket.io that build is finished
  },
  { connection: redisConnection }
);

worker.on('failed', async (job, err) => {
  const { buildId } = job.data;
  // TODO save err.message to show it to the end user
  await prisma.appBuild.update({
    where: { id: buildId },
    data: {
      status: 'ERRORED',
    },
  });
  debug(`${job.id} has failed for build ${buildId}: ${err.message}`);
});
