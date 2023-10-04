import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { DatabaseUnlinkPayload } from '../modules/databases/data/models/database_unlink.payload';
import { SubscriptionTopics } from './../data/models/subscription_topics';
import { DokkuDatabaseRepository } from './../lib/dokku/dokku.database.repository';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';
import { AppRepository } from './../modules/apps/data/repositories/app.repository';
import { DatabaseRepository } from './../modules/databases/data/repositories/database.repository';

interface QueueArgs {
  appId: string;
  databaseId: string;
  userId: string;
}

@Queue()
export class UnlinkDatabaseQueue extends IQueue<QueueArgs> {
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
    const { appId, databaseId, userId } = job.data;
    const app = await this.appRepository.get(appId);

    const database = await this.databaseRepository.get(databaseId);

    $log.info(
      `Empezando desenlace de ${database.type} ${database.name} con ${app.name}`
    );

    const res = await this.dokkuDatabaseRepository.unlink(
      database.name,
      database.type,
      app.name,
      {
        onStdout: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_UNLINKED, <
            DatabaseUnlinkPayload
          >{
            unlinkDatabaseLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_UNLINKED, <
            DatabaseUnlinkPayload
          >{
            unlinkDatabaseLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    await this.databaseRepository.update(database.id, {
      apps: {
        disconnect: { id: app.id },
      },
    });

    await this.activityRepository.add({
      name: `Base de datos "${database.name}" desenlazada de "${app.name}"`,
      description: database.id,
      referenceId: database.id,
      refersToModel: 'Database',
      Modifier: {
        connect: {
          id: userId,
        },
      },
    });

    $log.info(
      `Finalizando desenlace de ${database.type} ${database.name} con ${app.name}`
    );
    if (!res.stderr) {
      this.pubsub.publish(SubscriptionTopics.DATABASE_UNLINKED, <
        DatabaseUnlinkPayload
      >{
        unlinkDatabaseLogs: {
          message: '',
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      this.pubsub.publish(SubscriptionTopics.DATABASE_UNLINKED, <
        DatabaseUnlinkPayload
      >{
        unlinkDatabaseLogs: {
          message: '',
          type: 'end:failure',
        },
      });
    }
  }
}
