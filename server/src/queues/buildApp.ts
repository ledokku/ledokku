import { Worker, Queue } from 'bullmq';
import createDebug from 'debug';
import { resolve, join } from 'path';
import execa from 'execa';
import { config } from '../config';
import { io } from '../server';
import { prisma } from '../prisma';
import { existsSync, readFileSync, writeFileSync } from 'fs';

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
  connection: config.redisClient,
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

    const app = appBuild.app;
    await prisma.appBuild.update({
      where: { id: appBuild.id },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    // We send multiple logs at once to not spam the client
    let logs: RealtimeLog[] = [];
    let logTimerId: any;
    const sendLogs = (log: RealtimeLog) => {
      logs.push(log);
      clearTimeout(logTimerId);
      logTimerId = setTimeout(() => {
        io.emit(`app-build:${appBuild.id}`, logs);
        logs = [];
      }, 500);
    };

    const onStdout = (message: string) => {
      sendLogs({ message, type: 'stdout' });
      debug(`stdoutChunk: ${message}`);
    };
    const onStderr = (message: string) => {
      sendLogs({ message, type: 'stderr' });
      debug(`stderrChunk ${message}`);
    };

    const execCommand = async (
      command: string,
      args: string[],
      options: { cwd?: string } = {}
    ) => {
      debug('execCommand', command, args);
      io.emit(`app-build:${appBuild.id}`, [
        {
          // TODO concat args to command
          message: command,
          type: 'command',
        },
      ]);
      const subprocess = execa(command, args, options);
      subprocess.stdout.on('data', onStdout);
      subprocess.stderr.on('data', onStderr);
      const resultCommand = await subprocess;
      debug('resultCommand', resultCommand);
      return resultCommand;
    };

    // TODO only if folder does not exist clone
    // TODO otherwise git pull first

    const appFolderPath = resolve(__dirname, '..', '..', '.ledokku', app.name);

    // First step is to clone the github repo
    await execCommand('git', ['clone', app.githubRepoUrl, appFolderPath]);

    // Then we add the dokku remote that will trigger the build steps every time you commit
    await execCommand(
      'git',
      [
        'remote',
        'add',
        'dokku',
        `ssh://dokku@${config.dokkuSshHost}:${config.dokkuSshPort}/${app.name}`,
      ],
      { cwd: appFolderPath }
    );

    // We whitelist the ip into the known hosts
    // TODO only if needed
    // TODO move this part when the server is booting?
    const sshKnowHostPath = join(process.env.HOME, '/.ssh/known_hosts');
    const res = await execCommand('ssh-keyscan', [config.dokkuSshHost]);
    let sshKnowHostFile = '';
    if (existsSync(sshKnowHostPath)) {
      sshKnowHostFile = readFileSync(sshKnowHostPath, {
        encoding: 'utf8',
      });
    }
    sshKnowHostFile += res.stdout;
    writeFileSync(sshKnowHostPath, sshKnowHostFile, { encoding: 'utf8' });

    // Finally we push
    await execCommand('git', ['push', '-f', 'dokku', 'master'], {
      cwd: appFolderPath,
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
  { connection: config.redisClient }
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
