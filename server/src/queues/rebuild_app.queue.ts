import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';
import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { AppRebuildPayload } from '../modules/apps/data/models/app_rebuild.payload';
import { SubscriptionTopics } from './../data/models/subscription_topics';
import { DokkuAppRepository } from './../lib/dokku/dokku.app.repository';
import { AppRepository } from '../repositories';

interface QueueArgs {
  appName: string;
  appId: string;
  userId: string;
}

@Queue()
export class RebuildAppQueue extends IQueue<QueueArgs> {
  constructor(
    private dokkuAppRepository: DokkuAppRepository,
    private pubsub: PubSub,
    private activityRepository: ActivityRepository,
    private appRepository: AppRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appName, appId, userId } = job.data;

    $log.info(`Iniciando rebuild de ${appName}`);

    const res = await this.dokkuAppRepository.restart(appName, {
      onStdout: (chunk) => {
        this.pubsub.publish(SubscriptionTopics.APP_REBUILT, <AppRebuildPayload>{
          appRebuildLogs: {
            message: chunk.toString(),
            type: 'stdout',
          },
        });
      },
      onStderr: (chunk) => {
        this.pubsub.publish(SubscriptionTopics.APP_REBUILT, <AppRebuildPayload>{
          appRebuildLogs: {
            message: chunk.toString(),
            type: 'stderr',
          },
        });
      },
    });

    $log.info(`Finalizando rebuild de ${appName}`);

    await this.activityRepository.add({
      name: `Rebuild de "${appName}"`,
      referenceId: appId,
      refersToModel: 'App',
      Modifier: {
        connect: {
          id: userId,
        },
      },
    });

    if (!res.stderr) {
      this.pubsub.publish(SubscriptionTopics.APP_REBUILT, <AppRebuildPayload>{
        appRebuildLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      this.pubsub.publish(SubscriptionTopics.APP_REBUILT, <AppRebuildPayload>{
        appRebuildLogs: {
          message: 'Failed to rebuild app',
          type: 'end:failure',
        },
      });
    }
  }

  onFailed(job: Job<QueueArgs, any, string>, error: Error) {
    this.pubsub.publish(SubscriptionTopics.APP_REBUILT, <AppRebuildPayload>{
      appRebuildLogs: {
        message: 'Failed to rebuild app',
        type: 'end:failure',
      },
    });
  }
}
