import { AppBuildStatus } from '@prisma/client';
import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import execa from 'execa';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { LogPayload } from '../data/models/log_payload';
import { AppBuildRepository } from '../data/repositories/app_build.repository';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { DOKKU_SSH_HOST, DOKKU_SSH_PORT } from './../constants';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';

interface QueueArgs {
  buildId: string;
}

@Queue()
export class BuildAppQueue extends IQueue<QueueArgs> {
  constructor(
    private appBuildRepository: AppBuildRepository,
    private activityRepository: ActivityRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any>) {
    const { buildId } = job.data;

    $log.info(`Iniciando la construccion con el ID ${buildId}`);

    const appBuild = await this.appBuildRepository.get(buildId);

    await this.activityRepository.add({
      name: `Construcción de "${appBuild.app.name}"`,
      description: appBuild.appId,
      instance: appBuild,
    });

    if (!appBuild) {
      throw new Error(`AppBuild ${buildId} no encontrada en el Job ${job.id}`);
    }

    await this.appBuildRepository.updateStatus(
      buildId,
      AppBuildStatus.IN_PROGRESS
    );

    const app = appBuild.app;

    let logs: LogPayload[] = [];
    let logTimerId: any;

    const sendLogs = (log: LogPayload) => {
      logs.push(log);
      clearTimeout(logTimerId);
      logTimerId = setTimeout(() => {
        logs = [];
      }, 500);
    };

    const onStdout = (message: string) => {
      sendLogs({ message, type: 'stdout' });
    };
    const onStderr = (message: string) => {
      sendLogs({ message, type: 'stderr' });
    };

    const execCommand = async (
      command: string,
      args: string[],
      options: { cwd?: string } = {}
    ) => {
      // io.emit(`app-build:${appBuild.id}`, [
      //   {
      //     // TODO concat args to command
      //     message: command,
      //     type: 'command',
      //   },
      // ]);
      const subprocess = execa.execa(command, args, options);
      subprocess.stdout.on('data', onStdout);
      subprocess.stderr.on('data', onStderr);
      const resultCommand = await subprocess;
      return resultCommand;
    };

    // TODO only if folder does not exist clone
    // TODO otherwise git pull first

    const appFolderPath = resolve(__dirname, '..', '..', '.ledokku', app.name);

    // First step is to clone the github repo
    await execCommand('git', [
      'clone',
      /* app.githubRepoUrl */ '',
      appFolderPath,
    ]);

    // Then we add the dokku remote that will trigger the build steps every time you commit
    await execCommand(
      'git',
      [
        'remote',
        'add',
        'dokku',
        `ssh://dokku@${DOKKU_SSH_HOST}:${DOKKU_SSH_PORT}/${app.name}`,
      ],
      { cwd: appFolderPath }
    );

    // We whitelist the ip into the known hosts
    // TODO only if needed
    // TODO move this part when the server is booting?
    const sshKnowHostPath = join(process.env.HOME, '/.ssh/known_hosts');
    const res = await execCommand('ssh-keyscan', [DOKKU_SSH_HOST]);

    let sshKnowHostFile = '';
    if (existsSync(sshKnowHostPath)) {
      sshKnowHostFile = await readFile(sshKnowHostPath, {
        encoding: 'utf8',
      });
    }
    sshKnowHostFile += res.stdout;
    await writeFile(sshKnowHostPath, sshKnowHostFile, { encoding: 'utf8' });

    await execCommand('git', ['push', '-f', 'dokku', 'master'], {
      cwd: appFolderPath,
    });

    await this.appBuildRepository.updateStatus(
      buildId,
      AppBuildStatus.COMPLETED
    );
  }

  async onFailed(job: Job<QueueArgs, any>, error: Error) {
    const { buildId } = job.data;

    this.appBuildRepository.updateStatus(buildId, AppBuildStatus.ERRORED);

    $log.error(error);
  }
}
