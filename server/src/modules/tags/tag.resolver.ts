import { ResolverService } from '@tsed/typegraphql';
import { Arg, Args, Authorized, Query } from 'type-graphql';
import { PaginationArgs } from '../../data/args/pagination';
import {
  AppRepository,
  DatabaseRepository,
  TagRepository,
} from '../../repositories';
import { AppPaginationInfo } from '../apps/data/models/app.model';
import { DatabasePaginationInfo } from '../databases/data/models/database.model';
import { Tag } from './data/models/tag.model';

@ResolverService()
export class TagResolver {
  constructor(
    private appRepository: AppRepository,
    private databaseRepository: DatabaseRepository,
    private tagRepository: TagRepository
  ) {}

  @Query((returns) => [Tag])
  @Authorized()
  allTags(): Promise<Tag[]> {
    return this.tagRepository.getAll();
  }

  @Query((returns) => AppPaginationInfo)
  @Authorized()
  appsWithTag(
    @Args((type) => PaginationArgs) pagination: PaginationArgs,
    @Arg('name', (type) => String) tagName: string
  ): Promise<AppPaginationInfo> {
    return this.appRepository.getAllPaginated(pagination, {
      tags: {
        some: {
          name: tagName,
        },
      },
    });
  }

  @Query((returns) => DatabasePaginationInfo)
  @Authorized()
  databasesWithTag(
    @Args((type) => PaginationArgs) pagination: PaginationArgs,
    @Arg('name', (type) => String) tagName: string
  ): Promise<DatabasePaginationInfo> {
    return this.databaseRepository.getAllPaginated(pagination, {
      Tags: {
        some: {
          name: tagName,
        },
      },
    });
  }
}
