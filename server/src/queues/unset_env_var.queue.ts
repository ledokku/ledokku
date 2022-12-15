import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { DokkuAppRepository } from '../lib/dokku/dokku.app.repository';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { AppRepository } from '../repositories';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';

interface QueueArgs {
  appName: string;
  appId: string;
  key: string;
}

@Queue()
export class UnsetEnvVarQueue extends IQueue<QueueArgs> {
  constructor(
    private dokkuAppRepository: DokkuAppRepository,
    private activityRepository: ActivityRepository,
    private appRepository: AppRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appName, key, appId } = job.data;

    $log.info(
      `Iniciando resignacion de la variable de entorno ${appName} con ${key}`
    );

    await this.dokkuAppRepository.unsetEnvVar(appName, key);
    await this.activityRepository.add({
      name: `Variable de entorno "${key}" eliminada`,
      instance: await this.appRepository.get(appId),
    });

    $log.info(
      `Finalizando resignacion de la variable de entorno ${appName} con ${key}`
    );
  }
}
