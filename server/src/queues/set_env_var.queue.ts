import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { sshConnect } from '../lib/ssh';
import { DokkuAppRepository } from './../lib/dokku/dokku.app.repository';

interface QueueArgs {
  appName: string;
  key: string;
  value: string;
}

@Queue()
export class SetEnvVarQueue extends IQueue<QueueArgs> {
  constructor(private dokkuAppRepository: DokkuAppRepository) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appName, key, value } = job.data;

    $log.debug(
      `Iniciando asignacion de la variable de entorno ${appName} con ${key}=${value}`
    );

    const ssh = await sshConnect();

    await this.dokkuAppRepository.setEnvVar(ssh, appName, { key, value });

    $log.debug(
      `Finalizando asignacion de la variable de entorno ${appName} con ${key}=${value}`
    );

    ssh.dispose();
  }
}
