import { DbTypes } from '@prisma/client';
import { $log } from '@tsed/common';
import { Job } from 'bullmq';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionTopics } from '../data/models/subscription_topics';
import { IQueue, Queue } from '../lib/queues/queue.decorator';
import { DatabaseCreatedPayload } from '../modules/databases/data/models/database_created.payload';
import { DokkuDatabaseRepository } from './../lib/dokku/dokku.database.repository';
import { ActivityRepository } from './../modules/activity/data/repositories/activity.repository';
import { DatabaseRepository } from './../modules/databases/data/repositories/database.repository';

interface QueueArgs {
  databaseName: string;
  version?: string;
  databaseType: DbTypes;
  userId: string;
}

@Queue()
export class CreateDatabaseQueue extends IQueue<QueueArgs> {
  constructor(
    private pubsub: PubSub,
    private dokkuDatabaseRepository: DokkuDatabaseRepository,
    private databaseRepository: DatabaseRepository,
    private activityRepository: ActivityRepository
  ) {
    super();
  }

  protected async execute(job: Job<QueueArgs, any>) {
    const { databaseName, databaseType, userId, version } = job.data;

    $log.info(
      `Iniciando construccion de la base de datos ${databaseType} llamada ${databaseName}`
    );

    const res = await this.dokkuDatabaseRepository.create(
      databaseName,
      databaseType,
      version,
      {
        onStdout: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
            DatabaseCreatedPayload
          >{
            createDatabaseLogs: {
              message: chunk.toString(),
              type: 'stdout',
            },
          });
        },
        onStderr: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
            DatabaseCreatedPayload
          >{
            createDatabaseLogs: {
              message: chunk.toString(),
              type: 'stderr',
            },
          });
        },
      }
    );

    const dokkuDatabaseVersion = await this.dokkuDatabaseRepository.version(
      databaseName,
      databaseType
    );

    const createdDb = await this.databaseRepository.create({
      name: databaseName,
      type: databaseType,
      version: dokkuDatabaseVersion,
    });

    await this.activityRepository.add({
      name: `Base de datos "${createdDb.name}" creada`,
      description: createdDb.id,
      referenceId: createdDb.id,
      refersToModel: 'Database',
      Modifier: {
        connect: {
          id: userId,
        },
      },
    });

    $log.info(
      `Finalizando la creacion de la base de datos ${databaseType} llamada ${databaseName}`
    );

    if (!res.stderr) {
      this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
        DatabaseCreatedPayload
      >{
        createDatabaseLogs: {
          message: createdDb.id,
          type: 'end:success',
        },
      });
    } else if (res.stderr) {
      this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
        DatabaseCreatedPayload
      >{
        createDatabaseLogs: {
          message: `Creacion de la base de datos fallida.\n${res.stderr}`,
          type: 'end:failure',
        },
      });
    }
  }

  async onFailed(job: Job<QueueArgs, any, string>, error: Error) {
    this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
      DatabaseCreatedPayload
    >{
      createDatabaseLogs: {
        message: `Creacion de la base de datos fallida, ${error}`,
        type: 'end:failure',
      },
    });

    const dbToDelete = await this.databaseRepository.getByName(
      job.data.databaseName,
      job.data.databaseType
    );

    if (dbToDelete) {
      await this.databaseRepository.delete(dbToDelete.id);

      await this.dokkuDatabaseRepository.destroy(
        dbToDelete.name,
        dbToDelete.type
      );
    }
  }
}
