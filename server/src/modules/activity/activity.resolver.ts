import { ResolverService } from '@tsed/typegraphql';
import { Args, FieldResolver, Query, Root } from 'type-graphql';
import { PaginationArgs } from '../../data/args/pagination';
import { AppBuild } from '../app_build/data/models/app_build.model';
import { Database } from '../databases/data/models/database.model';
import {
  Activity,
  ActivityModelUnion,
  ActivityPaginationInfo,
} from './data/models/activity.model';
import { ActivityRepository } from './data/repositories/activity.repository';

@ResolverService(Activity)
export class ActivityResolver {
  constructor(private activityRepository: ActivityRepository) {}

  @Query((returns) => ActivityPaginationInfo)
  async activity(
    @Args((type) => PaginationArgs) pagination: PaginationArgs
  ): Promise<ActivityPaginationInfo> {
    return this.activityRepository.getAllPaginated(pagination);
  }

  @FieldResolver((returns) => ActivityModelUnion, { nullable: true })
  async reference(
    @Root() activity: Activity
  ): Promise<Activity | Database | AppBuild | undefined> {
    return this.activityRepository.getModelReference(
      activity.refersToModel,
      activity.referenceId
    );
  }
}
