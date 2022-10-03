import { BadRequest, Conflict, NotFound } from '@tsed/exceptions';
import { ResolverService } from '@tsed/typegraphql';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Root,
  Subscription,
} from 'type-graphql';
import { dbTypeToDokkuPlugin } from '../../config/utils';
import { DokkuContext } from '../../data/models/dokku_context';
import { LogPayload } from '../../data/models/log_payload';
import { SubscriptionTopics } from '../../data/models/subscription_topics';
import { DokkuDatabaseRepository } from '../../lib/dokku/dokku.database.repository';
import { DokkuPluginRepository } from '../../lib/dokku/dokku.plugin.repository';
import { CreateDatabaseQueue } from '../../queues/create_database.queue';
import { App } from '../apps/data/models/app.model';
import { Logs } from '../apps/data/models/logs.model';
import { BooleanResult } from '../apps/data/models/result.model';
import { CreateDatabaseInput } from './data/inputs/create_database.input';
import { DestroyDatabaseInput } from './data/inputs/destroy_database.input';
import { Database } from './data/models/database.model';
import { DatabaseCreatedPayload } from './data/models/database_created.payload';
import { DatabaseInfo } from './data/models/database_info.model';
import { DatabaseLinkPayload } from './data/models/database_link.payload';
import { DatabaseUnlinkPayload } from './data/models/database_unlink.payload';
import { IsDatabaseLinked } from './data/models/is_database_linked.model';
import { DatabaseRepository } from './data/repositories/database.repository';

@ResolverService(Database)
export class DatabaseResolver {
  constructor(
    private databaseRepository: DatabaseRepository,
    private dokkuDatabaseRepository: DokkuDatabaseRepository,
    private dokkuPluginRepository: DokkuPluginRepository,
    private createDatabaseQueue: CreateDatabaseQueue
  ) {}

  @Authorized()
  @Query((returns) => Database)
  async database(
    @Arg('databaseId', (type) => String) databaseId: string
  ): Promise<Database> {
    return this.databaseRepository.get(databaseId);
  }

  @Authorized()
  @Query((returns) => [Database])
  async databases(): Promise<Database[]> {
    return this.databaseRepository.getAll();
  }

  @Authorized()
  @Query((returns) => DatabaseInfo)
  async databaseInfo(
    @Arg('databaseId') databaseId: string,
    @Ctx() context: DokkuContext
  ): Promise<DatabaseInfo> {
    const database = await this.databaseRepository.get(databaseId);

    if (!database) {
      throw new NotFound(`La base de datos no existe con ID ${databaseId}`);
    }

    const info = await this.dokkuDatabaseRepository.database(
      context.sshContext.connection,
      database.name,
      database.type
    );

    return { info };
  }

  @Authorized()
  @Query((returns) => Logs)
  async databaseLogs(
    @Arg('databaseId') databaseId: string,
    @Ctx() context: DokkuContext
  ): Promise<Logs> {
    const database = await this.databaseRepository.get(databaseId);

    if (!database) {
      throw new NotFound(`La base de datos no existe con ID ${databaseId}`);
    }

    const logs = await this.dokkuDatabaseRepository.logs(
      context.sshContext.connection,
      database.name,
      database.type
    );

    return { logs };
  }

  @Authorized()
  @Query((returns) => IsDatabaseLinked)
  async isDatabaseLinked(
    @Arg('databaseId') databaseId: string,
    @Arg('appId') appId: string
  ): Promise<IsDatabaseLinked> {
    const linkedApps = await this.databaseRepository.linkedApp(
      databaseId,
      appId
    );

    return { isLinked: linkedApps.length === 1 };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async createDatabase(
    @Arg('input', (type) => CreateDatabaseInput) input: CreateDatabaseInput,
    @Ctx() context: DokkuContext
  ): Promise<BooleanResult> {
    if (!/^[a-z0-9-]+$/.test(input.name))
      throw new BadRequest('Mal formato del nombre');

    const databaseExists = await this.databaseRepository.exists(input.name);

    if (databaseExists) {
      throw new Conflict('Nombre ya utilizado');
    }

    const dokkuPlugins = await this.dokkuPluginRepository.list(
      context.sshContext.connection
    );

    const isDbInstalled =
      dokkuPlugins.plugins.filter(
        (plugin) => plugin.name === dbTypeToDokkuPlugin(input.type)
      ).length !== 0;

    if (!isDbInstalled) {
      throw new NotFound(`La base de datos ${input.type} no esta instalada`);
    }

    await this.createDatabaseQueue.add({
      databaseName: input.name,
      databaseType: input.type,
      userId: context.auth.userId,
    });

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async destroyDatabase(
    @Arg('input', (type) => DestroyDatabaseInput) input: DestroyDatabaseInput,
    @Ctx() context: DokkuContext
  ) {
    const databaseToDelete = await this.databaseRepository.get(
      input.databaseId
    );

    if (!databaseToDelete) {
      throw new NotFound(
        `La base de datos no existe con ID ${input.databaseId}`
      );
    }

    const result = await this.dokkuDatabaseRepository.destroy(
      context.sshContext.connection,
      databaseToDelete.name,
      databaseToDelete.type
    );

    await this.databaseRepository.delete(input.databaseId);

    return { result };
  }

  @Authorized()
  @Subscription((type) => LogPayload, {
    topics: SubscriptionTopics.DATABASE_UNLINKED,
  })
  unlinkDatabaseLogs(@Root() payload: DatabaseUnlinkPayload): LogPayload {
    return payload.unlinkDatabaseLogs;
  }

  @Authorized()
  @Subscription((type) => LogPayload, {
    topics: SubscriptionTopics.DATABASE_LINKED,
  })
  linkDatabaseLogs(@Root() payload: DatabaseLinkPayload): LogPayload {
    return payload.linkDatabaseLogs;
  }

  @Authorized()
  @Subscription((type) => LogPayload, {
    topics: SubscriptionTopics.DATABASE_CREATED,
  })
  createDatabaseLogs(@Root() payload: DatabaseCreatedPayload): LogPayload {
    return payload.createDatabaseLogs;
  }

  @Authorized()
  @FieldResolver((returns) => [App])
  apps(@Root() database: Database): Promise<App[]> {
    return this.databaseRepository.linkedApps(database.id);
  }
}
