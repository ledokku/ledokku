import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { ActivityRepository } from '../modules/activity/data/repositories/activity.repository';
import { AppRepository } from '../repositories';
import { DokkuAppRepository } from './../lib/dokku/dokku.app.repository';

interface QueueArgs {
  appName: string;
  key: string;
  value: string;
  appId: string;
  userId: string;
}

@Queue()
export class SetEnvVarQueue extends IQueue<QueueArgs> {
  constructor(
    private dokkuAppRepository: DokkuAppRepository,
    private activityRepository: ActivityRepository,
    private appRepository: AppRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appName, key, value, appId, userId } = job.data;

    $log.info(
      `Iniciando asignacion de la variable de entorno ${appName} con ${key}=${value}`
    );

    await this.dokkuAppRepository.setEnvVar(appName, { key, value });
    await this.activityRepository.add({
      name: `Variable de entorno en "${appName}"`,
      description: `${key}: ${value}`,
      referenceId: appId,
      refersToModel: 'App',
      Modifier: {
        connect: {
          id: userId,
        },
      },
    });

    $log.info(
      `Finalizando asignacion de la variable de entorno ${appName} con ${key}=${value}`
    );
  }
}
