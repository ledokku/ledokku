import { App, AppStatus } from "@prisma/client";
import { $log } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Job } from "bullmq";
import { PubSub } from "graphql-subscriptions";
import { Arg, Ctx } from "type-graphql";
import { DokkuContext } from "../data/models/dokku_context";
import { SubscriptionTopics } from "../data/models/subscription_topics";
import { IQueue, Queue } from "../lib/queues/queue.decorator";
import { LinkDatabaseInput } from "../modules/apps/data/inputs/link_database.input";
import { AppCreatedPayload } from "../modules/apps/data/models/app_created.payload";
import { DokkuAppRepository } from "./../lib/dokku/dokku.app.repository";
import { DokkuGitRepository } from "./../lib/dokku/dokku.git.repository";
import { DokkuProxyRepository } from "./../lib/dokku/dokku.proxy.repository";
import { ProxyPort } from "./../lib/dokku/models/proxy_ports.model";
import { ActivityRepository } from "./../modules/activity/data/repositories/activity.repository";
import { AppRepository } from "./../modules/apps/data/repositories/app.repository";
import { DatabaseRepository } from "./../modules/databases/data/repositories/database.repository";
import { LinkDatabaseQueue } from "./link_database.queue";

interface QueueArgs {
  appId: string;
  userName: string;
  token: string;
  deleteOnFailed?: boolean;
  databaseId?: string;
}

@Queue()
export class DeployAppQueue extends IQueue<QueueArgs, App> {
  constructor(
    private appRepository: AppRepository,
    private databaseRepository: DatabaseRepository,
    private dokkuGitRepository: DokkuGitRepository,
    private pubsub: PubSub,
    private activityRepository: ActivityRepository,
    private linkDatabaseQueue: LinkDatabaseQueue,
    private dokkuAppRepository: DokkuAppRepository,
    private dokkuProxyRepository: DokkuProxyRepository
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
    const branchName = branch ? branch : "main";

    await this.dokkuGitRepository.auth(userName, token);
    await this.dokkuGitRepository.unlock(app.name);

    await this.dokkuGitRepository.sync(
      app.name,
      `https://github.com/${repoOwner}/${repoName}.git`,
      branchName,
      {
        onStdout: (chunk) => {
          const payload = {
            appCreateLogs: {
              message: chunk.toString(),
              type: "stdout",
            },
            appId,
          } as AppCreatedPayload;
          this.appRepository.addCreateLog(appId, payload.appCreateLogs);
          this.pubsub.publish(SubscriptionTopics.APP_CREATED, payload);
        },
        onStderr: (chunk) => {
          const payload = {
            appCreateLogs: {
              message: chunk.toString(),
              type: "stderr",
            },
            appId,
          } as AppCreatedPayload;
          this.appRepository.addCreateLog(appId, payload.appCreateLogs);
          this.pubsub.publish(SubscriptionTopics.APP_CREATED, payload);
        },
      }
    );

    const currentPorts = await this.dokkuProxyRepository
      .ports(app.name)
      .catch((err) => [] as ProxyPort[]);

    if (currentPorts.length > 0) {
      const webPort = currentPorts.find((it) => it.host === "80");

      if (!webPort) {
        await this.dokkuProxyRepository.add(
          app.name,
          "http",
          "80",
          currentPorts[0].container
        );
      }

      await this.dokkuAppRepository
        .enableSSL(app.name)
        .catch((e) => $log.warn(e));
    }

    $log.info(
      `Finalizando de crear ${app.name} desde https://github.com/${repoOwner}/${repoName}.git`
    );

    return app;
  }
  
  async onSuccess(job: Job<QueueArgs, any, string>, result: App) {
    
    const payload = <AppCreatedPayload>{
      appCreateLogs: {
        message: result.id,
        type: "end:success",
      },
      appId: job.data.appId,
    };

    this.pubsub?.publish(SubscriptionTopics.APP_CREATED, payload);
    this.appRepository.addCreateLog(result.id, payload.appCreateLogs);

    const { repoOwner, repoName, branch } = await this.appRepository
      .get(job.data.appId)
      .AppMetaGithub();

    await this.appRepository.update(job.data.appId, {
      status: AppStatus.RUNNING,
    });

    if(job.data.databaseId)
    {
      const database = await this.databaseRepository.databaseWithApps(
        job.data.databaseId,
        job.data.appId
      );
  
      if (!database) {
        throw new NotFound(
          `La base de datos no existe con ID ${job.data.databaseId}`
        );
      }
  
      const isLinked = database.apps.length === 1;
  
      if (isLinked) {
        throw new Error(
          `${database.name} database is already linked to ${result.name} app`
        );
      }
  
      await this.linkDatabaseQueue.add({
        appId: job.data.appId,
        databaseId: job.data.databaseId,
      });

    }

   

    await this.activityRepository.add({
      name: `Proyecto "${result.name}" lanzado`,
      description: `Desde https://github.com/${repoOwner}/${repoName}/tree/${branch}`,
      referenceId: job.data.appId,
      refersToModel: "App",
      Modifier: {
        connect: {
          username: job.data.userName,
        },
      },
    });
    
  }

  async onFailed(job: Job<QueueArgs, any>, error: Error) {
    const { appId, deleteOnFailed = true } = job.data;

    const payload = <AppCreatedPayload>{
      appCreateLogs: {
        message: "Failed to create an app",
        type: "end:failure",
      },
    };
    this.pubsub?.publish(SubscriptionTopics.APP_CREATED, payload);
    this.appRepository.addCreateLog(appId, payload.appCreateLogs);

    const app = await this.appRepository.get(appId);

    if(job.data.databaseId)
    {
      const database = await this.databaseRepository.databaseWithApps(
        job.data.databaseId,
        job.data.appId
      );
  
      if (!database) {
        throw new NotFound(
          `La base de datos no existe con ID ${job.data.databaseId}`
        );
      }
  
      const isLinked = database.apps.length === 1;
  
      if (isLinked) {
        throw new Error(
          `${database.name} database is already linked to ${app.name} app`
        );
      }
  
      await this.linkDatabaseQueue.add({
        appId: job.data.appId,
        databaseId: job.data.databaseId,
      });

    }

    if (deleteOnFailed) {
      $log.info(app);

      if (app) {
        await this.appRepository.delete(appId);

        await this.dokkuAppRepository.destroy(app.name);
      }
    } else {
      await this.appRepository.update(job.data.appId, {
        status: AppStatus.IDLE,
      });
      await this.activityRepository.add({
        name: `Lanzamiento de "${app.name}" fallido`,
        description: error.message,
        referenceId: job.data.appId,
        refersToModel: "App",
        Modifier: {
          connect: {
            username: job.data.userName,
          },
        },
      });
    }
  }
}
