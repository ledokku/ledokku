import { ResolverService } from '@tsed/typegraphql';
import { injectable } from 'tsyringe';
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { DokkuDatabaseRepository } from '../../lib/dokku/dokku.database.repository';
import { DokkuContext } from '../../models/dokku_context';
import { Logs } from '../apps/data/models/logs.model';
import { Database } from './data/models/database.model';
import { DatabaseInfo } from './data/models/database_info.model';
import { IsDatabaseLinked } from './data/models/is_database_linked.model';
import { DatabaseRepository } from './data/repositories/database.repository';

@injectable()
@Resolver(Database)
@ResolverService(Database)
export class DatabaseResolver {
  constructor(
    private databaseRepository: DatabaseRepository,
    private dokkuRepository: DokkuDatabaseRepository
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
      throw new Error(`La base de datos no existe con ID ${databaseId}`);
    }

    const info = await this.dokkuRepository.database(
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
      throw new Error(`La base de datos no existe con ID ${databaseId}`);
    }

    const logs = await this.dokkuRepository.logs(
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
    const linkedApps = await this.databaseRepository.linkedApps(
      databaseId,
      appId
    );

    return { isLinked: linkedApps.length === 1 };
  }
}
