import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { sshConnect } from '../lib/ssh';
import { AppRebuildPayload } from '../modules/apps/data/models/app_rebuild.payload';
import { SubscriptionTopics } from './../data/models/subscription_topics';
import { DokkuAppRepository } from './../lib/dokku/dokku.app.repository';

interface QueueArgs {
  appName: string;
}

@Queue()
export class RebuildAppQueue extends IQueue<QueueArgs> {
  constructor(
    private dokkuAppRepository: DokkuAppRepository,
    private pubsub: PubSub
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appName } = job.data;

    $log.debug(`Iniciando rebuild de ${appName}`);

    const ssh = await sshConnect();

    const res = await this.dokkuAppRepository.restart(ssh, appName, {
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

    $log.debug(`Finalizando rebuild de ${appName}`);

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
    ssh.dispose();
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
