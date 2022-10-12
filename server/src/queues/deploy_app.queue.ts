import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { sshConnect } from '../lib/ssh';
import { AppCreatedPayload } from '../modules/apps/data/models/app_created.payload';
import { DokkuGitRepository } from './../lib/dokku/dokku.git.repository';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';
import { AppRepository } from './../modules/apps/data/repositories/app.repository';

interface QueueArgs {
  appId: string;
  userName: string;
  token: string;
}

@Queue()
export class DeployAppQueue extends IQueue<QueueArgs> {
  constructor(
    private appRepository: AppRepository,
    private dokkuGitRepository: DokkuGitRepository,
    private pubsub: PubSub,
    private activityRepository: ActivityRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any>) {
    const { appId, userName, token } = job.data;

    $log.info(`Iniciando el lanzamiento de la app ${appId}`);

    const app = await this.appRepository.get(appId);
    const appMetaGithub = await this.appRepository.get(appId).AppMetaGithub();

    const { branch, repoName, repoOwner } = appMetaGithub;
    const branchName = branch ? branch : 'main';

    const ssh = await sshConnect();

    await this.dokkuGitRepository.auth(ssh, userName, token);
    await this.dokkuGitRepository.unlock(ssh, app.name);

    const res = await this.dokkuGitRepository.sync(
      ssh,
      app.name,
      `https://github.com/${repoOwner}/${repoName}.git`,
      branchName,
      {
        onStdout: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.APP_CREATED, <
            AppCreatedPayload
          >{
            appCreateLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.APP_CREATED, <
            AppCreatedPayload
          >{
            appCreateLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    $log.info(
      `Finalizando de crear ${app.name} desde https://github.com/${repoOwner}/${repoName}.git`
    );

    await this.activityRepository.add({
      name: `Proyecto "${app.name}" creado`,
      description: `Creado desde https://github.com/${repoOwner}/${repoName}.git`,
      instance: app,
    });

    if (!res.stderr) {
      this.pubsub.publish(SubscriptionTopics.APP_CREATED, <AppCreatedPayload>{
        appCreateLogs: {
          message: appId,
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      this.pubsub.publish(SubscriptionTopics.APP_CREATED, <AppCreatedPayload>{
        appCreateLogs: {
          message: 'Failed to create app',
          type: 'end:failure',
        },
      });
    }
  }

  onFailed(job: Job<QueueArgs, any>, error: Error) {
    this.pubsub.publish(SubscriptionTopics.APP_CREATED, <AppCreatedPayload>{
      appCreateLogs: {
        message: 'Failed to create an app',
        type: 'end:failure',
      },
    });
  }
}
