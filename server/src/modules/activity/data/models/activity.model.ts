import { Activity as ActivityClass, ModelReferences } from '@prisma/client';
import { createUnionType, Field, ObjectType } from 'type-graphql';
import { BasePaginationInfo } from '../../../../data/models/pagination_info';
import { App } from '../../../apps/data/models/app.model';
import { AppBuild } from '../../../app_build/data/models/app_build.model';
import { Database } from '../../../databases/data/models/database.model';
import { GraphQLDateTime } from './../../../../utils';

@ObjectType()
export class Activity implements ActivityClass {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String, { nullable: true })
  description: string | null;

  @Field((type) => GraphQLDateTime)
  createdAt: Date;

  @Field((type) => GraphQLDateTime)
  updatedAt: Date;

  refersToModel: ModelReferences | null;
  referenceId: string | null;
  modifierId: string | null;
}
@ObjectType()
export class ActivityPaginationInfo extends BasePaginationInfo(Activity) {}

export const ActivityModelUnion = createUnionType({
  name: 'ActivityModelUnion',
  types: () => [AppBuild, App, Database],
});
