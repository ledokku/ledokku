import { ResolverService } from '@tsed/typegraphql';
import { Arg, Args, Authorized, Mutation, Query } from 'type-graphql';
import { PaginationArgs } from '../../data/args/pagination';
import {
  AppRepository,
  DatabaseRepository,
  TagRepository,
} from '../../repositories';
import { App, AppPaginationInfo } from '../apps/data/models/app.model';
import {
  Database,
  DatabasePaginationInfo,
} from '../databases/data/models/database.model';
import { TagUpdateInput } from './data/inputs/tag_update.input';
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

  @Mutation((returns) => App)
  @Authorized()
  async setAppTags(
    @Arg('input', (type) => TagUpdateInput) { id, tags }: TagUpdateInput
  ) {
    await this.tagRepository.ensureExist(tags);
    return this.appRepository.update(id, {
      tags: {
        set: tags.map((it) => ({
          name: it,
        })),
      },
    });
  }

  @Mutation((returns) => Database)
  @Authorized()
  async setDatabaseTags(
    @Arg('input', (type) => TagUpdateInput) { id, tags }: TagUpdateInput
  ) {
    await this.tagRepository.ensureExist(tags);
    return this.databaseRepository.update(id, {
      Tags: {
        set: tags.map((it) => ({
          name: it,
        })),
      },
    });
  }
}
