import { Database, DbTypes } from "@prisma/client";
import { $log } from "@tsed/common";
import { Job } from "bullmq";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionTopics } from "../data/models/subscription_topics";
import { IQueue, Queue } from "../lib/queues/queue.decorator";
import { DatabaseCreatedPayload } from "../modules/databases/data/models/database_created.payload";
import { DokkuDatabaseRepository } from "./../lib/dokku/dokku.database.repository";
import { ActivityRepository } from "./../modules/activity/data/repositories/activity.repository";
import { DatabaseRepository } from "./../modules/databases/data/repositories/database.repository";

interface QueueArgs {
  databaseId: string;
  image?: string;
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
    const { databaseId, userId, image } = job.data;
    const database = await this.databaseRepository.get(databaseId);

    $log.info(
      `Iniciando construccion de la base de datos ${database.type} llamada ${database.name}`
    );

    await this.dokkuDatabaseRepository.create(
      database.name,
      database.type,
      database.version,
      image,
      {
        onStdout: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
            DatabaseCreatedPayload
          >{
            createDatabaseLogs: {
              message: chunk.toString(),
              type: "stdout",
            },
          });
        },
        onStderr: (chunk) => {
          this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
            DatabaseCreatedPayload
          >{
            createDatabaseLogs: {
              message: chunk.toString(),
              type: "stderr",
            },
          });
        },
      }
    );

    $log.info(
      `Finalizando la creacion de la base de datos ${database.type} llamada ${database.name}`
    );

    return database;
  }

  async onSuccess(job: Job<QueueArgs, any, string>, database: Database) {
    const { userId } = job.data;

    await this.activityRepository.add({
      name: `Base de datos "${database.name}" creada`,
      description: database.id,
      referenceId: database.id,
      refersToModel: "Database",
      Modifier: {
        connect: {
          id: userId,
        },
      },
    });

    this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
      DatabaseCreatedPayload
    >{
      createDatabaseLogs: {
        message: `Base de datos creada con exito`,
        type: "end:success",
      },
    });
  }

  async onFailed(job: Job<QueueArgs, any, string>, error: Error) {
    const { databaseId } = job.data;
    const database = await this.databaseRepository.get(databaseId);

    this.pubsub.publish(SubscriptionTopics.DATABASE_CREATED, <
      DatabaseCreatedPayload
    >{
      createDatabaseLogs: {
        message: `Creacion de la base de datos fallida, ${error}`,
        type: "end:failure",
      },
    });

    const dbToDelete = await this.databaseRepository.getByName(
      database.name,
      database.type
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
