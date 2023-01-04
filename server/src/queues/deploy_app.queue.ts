import { App, AppStatus } from '@prisma/client';
import { $log } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { AppCreatedPayload } from '../modules/apps/data/models/app_created.payload';
import { DokkuAppRepository } from './../lib/dokku/dokku.app.repository';
import { DokkuGitRepository } from './../lib/dokku/dokku.git.repository';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';
import { AppRepository } from './../modules/apps/data/repositories/app.repository';

interface QueueArgs {
  appId: string;
  userName: string;
  token: string;
  deleteOnFailed?: boolean;
}

@Queue()
export class DeployAppQueue extends IQueue<QueueArgs, App> {
  constructor(
    private appRepository: AppRepository,
    private dokkuGitRepository: DokkuGitRepository,
    private pubsub: PubSub,
    private activityRepository: ActivityRepository,
    private dokkuAppRepository: DokkuAppRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any>) {
    const { appId, userName, token } = job.data;

    $log.info(`Iniciando el lanzamiento de la app ${appId}`);

    const app = await this.appRepository.get(appId);

    await this.appRepository.update(appId, {
      status: AppStatus.BUILDING,
    });

    this.appRepository.clearCreateLogs(appId);

    const appMetaGithub = await this.appRepository.get(appId).AppMetaGithub();

    const { branch, repoName, repoOwner } = appMetaGithub;
    const branchName = branch ? branch : 'main';

    await this.dokkuGitRepository.auth(userName, token);
    await this.dokkuGitRepository.unlock(app.name);

    await this.dokkuGitRepository.sync(
      app.name,
      `https://github.com/${repoOwner}/${repoName}.git`,
      branchName,
      {
        onStdout: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.APP_CREATED, {
            appCreateLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
            appId,
          } as AppCreatedPayload);
        },
        onStderr: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.APP_CREATED, <
            AppCreatedPayload
          >{
            appCreateLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
            appId,
          });
        },
      }
    );

    $log.info(
      `Finalizando de crear ${app.name} desde https://github.com/${repoOwner}/${repoName}.git`
    );

    return app;
  }

  async onSuccess(job: Job<QueueArgs, any, string>, result: App) {
    this.pubsub?.publish(SubscriptionTopics.APP_CREATED, <AppCreatedPayload>{
      appCreateLogs: {
        message: result.id,
        type: 'end:success',
      },
      appId: job.data.appId,
    });
    const { repoOwner, repoName, branch } = await this.appRepository
      .get(job.data.appId)
      .AppMetaGithub();

    await this.appRepository.update(job.data.appId, {
      status: AppStatus.RUNNING,
    });

    await this.activityRepository.add({
      name: `Proyecto "${result.name}" lanzado`,
      description: `Desde https://github.com/${repoOwner}/${repoName}/tree/${branch}`,
      referenceId: job.data.appId,
      refersToModel: 'App',
      Modifier: {
        connect: {
          username: job.data.userName,
        },
      },
    });
  }

  async onFailed(job: Job<QueueArgs, any>, error: Error) {
    this.pubsub?.publish(SubscriptionTopics.APP_CREATED, <AppCreatedPayload>{
      appCreateLogs: {
        message: 'Failed to create an app',
        type: 'end:failure',
      },
    });

    const { appId, deleteOnFailed = true } = job.data;

    const app = await this.appRepository.get(appId);

    if (deleteOnFailed) {
      $log.info(app);

      if (app) {
        await this.appRepository.delete(appId);

        await this.dokkuAppRepository.destroy(app.name);
      }
    } else {
      await this.activityRepository.add({
        name: `Lanzamiento de "${app.name}" fallido`,
        description: error.message,
        referenceId: job.data.appId,
        refersToModel: 'App',
        Modifier: {
          connect: {
            username: job.data.userName,
          },
        },
      });
    }
  }
}
