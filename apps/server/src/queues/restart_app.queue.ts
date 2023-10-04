import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { DokkuAppRepository } from '../lib/dokku/dokku.app.repository';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { AppRestartPayload } from '../modules/apps/data/models/app_restart.payload';
import { AppRepository } from '../repositories';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';

interface QueueArgs {
  appName: string;
  appId: string;
  userId: string;
}

@Queue()
export class RestartAppQueue extends IQueue<QueueArgs> {
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

    $log.info(`Iniciando reinicio de ${appName}`);

    const res = await this.dokkuAppRepository.restart(
      appName,

      {
        onStdout: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.APP_RESTARTED, <
            AppRestartPayload
          >{
            appRestartLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.APP_RESTARTED, <
            AppRestartPayload
          >{
            appRestartLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    $log.info(`Finalizando reinicio de ${appName}`);

    await this.activityRepository.add({
      name: `Reinicio de "${appName}"`,
      referenceId: appId,
      refersToModel: 'App',
      Modifier: {
        connect: {
          id: userId,
        },
      },
    });

    if (!res.stderr) {
      this.pubsub.publish(SubscriptionTopics.APP_RESTARTED, <AppRestartPayload>{
        appRestartLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      this.pubsub.publish(SubscriptionTopics.APP_RESTARTED, <AppRestartPayload>{
        appRestartLogs: {
          message: 'Failed to restart app',
          type: 'end:failure',
        },
      });
    }
  }

  onFailed(job: Job<QueueArgs, any, string>, error: Error) {
    this.pubsub.publish(SubscriptionTopics.APP_RESTARTED, <AppRestartPayload>{
      appRestartLogs: {
        message: 'Failed restart app',
        type: 'end:failure',
      },
    });
  }
}
