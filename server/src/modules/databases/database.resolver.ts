import { ResolverService } from '@tsed/typegraphql';
import { injectable } from 'tsyringe';
import { Arg, Authorized, Query, Resolver } from 'type-graphql';
import { Database } from './data/models/database.model';
import { DatabaseRepository } from './data/repositories/database.repository';

@injectable()
@Resolver(Database)
@ResolverService(Database)
export class DatabaseResolver {
  constructor(private databaseRepository: DatabaseRepository) {}

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
}
