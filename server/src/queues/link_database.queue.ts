import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { sshConnect } from '../lib/ssh';
import { DatabaseLinkPayload } from '../modules/databases/data/models/database_link.payload';
import { DokkuDatabaseRepository } from './../lib/dokku/dokku.database.repository';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';
import { AppRepository } from './../modules/apps/data/repositories/app.repository';
import { DatabaseRepository } from './../modules/databases/data/repositories/database.repository';

interface QueueArgs {
  appId: string;
  databaseId: string;
}

@Queue()
export class LinkDatabaseQueue extends IQueue<QueueArgs> {
  constructor(
    private appRepository: AppRepository,
    private databaseRepository: DatabaseRepository,
    private dokkuDatabaseRepository: DokkuDatabaseRepository,
    private pubsub: PubSub,
    private activityRepository: ActivityRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any, string>) {
    const { appId, databaseId } = job.data;
    const app = await this.appRepository.get(appId);

    const database = await this.databaseRepository.get(databaseId);

    $log.info(
      `Iniciando el enlace a la base de datos ${database.type} ${database.name} con ${app.name}`
    );

    const ssh = await sshConnect();

    const res = await this.dokkuDatabaseRepository.link(
      ssh,
      database.name,
      database.type,
      app.name,
      {
        onStdout: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_LINKED, <
            DatabaseLinkPayload
          >{
            linkDatabaseLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_LINKED, <
            DatabaseLinkPayload
          >{
            linkDatabaseLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    await this.databaseRepository.update(database.id, {
      apps: {
        connect: { id: app.id },
      },
    });

    await this.activityRepository.add({
      name: `Base de datos "${database.name}" enlazada con "${app.name}"`,
      description: database.id,
      instance: database,
    });

    $log.info(
      `Terminando de enlazar ${database.type} ${database.name} con ${app.name}`
    );
    if (!res.stderr) {
      this.pubsub.publish(SubscriptionTopics.DATABASE_LINKED, <
        DatabaseLinkPayload
      >{
        linkDatabaseLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      this.pubsub.publish(SubscriptionTopics.DATABASE_LINKED, <
        DatabaseLinkPayload
      >{
        linkDatabaseLogs: {
          message: '',
          type: 'end:failure',
        },
      });
    }
    ssh.dispose();
  }
}
