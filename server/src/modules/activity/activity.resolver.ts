import { ResolverService } from '@tsed/typegraphql';
import { Query } from 'type-graphql';
import { Activity } from './data/models/activity.model';
import { ActivityRepository } from './data/repositories/activity.repository';

@ResolverService(Activity)
export class ActivityResolver {
  constructor(private activityRepository: ActivityRepository) {}

  @Query((returns) => Boolean)
  test() {}
}
