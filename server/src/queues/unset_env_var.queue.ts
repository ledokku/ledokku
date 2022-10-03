import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { sshConnect } from '../lib/ssh';
import { DokkuAppRepository } from '../lib/dokku/dokku.app.repository';

interface QueueArgs {
  appName: string;
  key: string;
}

@Queue()
export class UnsetEnvVarQueue extends IQueue<QueueArgs> {
  constructor(private dokkuAppRepository: DokkuAppRepository) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appName, key } = job.data;

    $log.debug(
      `Iniciando resignacion de la variable de entorno ${appName} con ${key}`
    );

    const ssh = await sshConnect();

    await this.dokkuAppRepository.unsetEnvVar(ssh, appName, key);

    $log.debug(
      `Finalizando resignacion de la variable de entorno ${appName} con ${key}`
    );

    ssh.dispose();
  }
}
