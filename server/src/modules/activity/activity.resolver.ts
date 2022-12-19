import { ResolverService } from '@tsed/typegraphql';
import {
  Arg,
  Args,
  Authorized,
  FieldResolver,
  Query,
  Root,
} from 'type-graphql';
import { PaginationArgs } from '../../data/args/pagination';
import { User } from '../../data/models/user';
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

  @Authorized()
  @Query((returns) => ActivityPaginationInfo)
  async activity(
    @Args((type) => PaginationArgs) pagination: PaginationArgs,
    @Arg('refId', (type) => String, { nullable: true })
    refId: string | undefined
  ): Promise<ActivityPaginationInfo> {
    return this.activityRepository.getAllPaginated(pagination, {
      referenceId: refId,
    });
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

  @FieldResolver((returns) => User, { nullable: true })
  async modifier(@Root() activity: Activity): Promise<User> {
    return this.activityRepository.getModifier(activity.id);
  }
}
