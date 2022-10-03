import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { DokkuAppRepository } from '../lib/dokku/dokku.app.repository';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { sshConnect } from '../lib/ssh';
import { AppRestartPayload } from '../modules/apps/data/models/app_restart.payload';

interface QueueArgs {
  appName: string;
}

@Queue()
export class RestartAppQueue extends IQueue<QueueArgs> {
  constructor(
    private dokkuAppRepository: DokkuAppRepository,
    private pubsub: PubSub
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appName } = job.data;

    $log.debug(`Iniciando reinicio de ${appName}`);

    const ssh = await sshConnect();
    const res = await this.dokkuAppRepository.restart(
      ssh,
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

    $log.debug(`Finalizando reinicio de ${appName}`);

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
    ssh.dispose();
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
