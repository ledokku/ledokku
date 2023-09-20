import { App as AppClass, AppStatus, AppTypes } from '@prisma/client';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { BasePaginationInfo } from '../../../../data/models/pagination_info';
import { GraphQLDateTime } from './../../../../utils';

@ObjectType()
export class App implements AppClass {
  @Field((type) => String)
  id: string;

  @Field((type) => GraphQLDateTime)
  createdAt: Date;

  @Field((type) => GraphQLDateTime)
  updatedAt: Date;

  @Field((type) => String)
  name: string;

  @Field((type) => AppTypes)
  type: AppTypes;

  @Field((type) => String)
  userId: string;

  @Field((type) => String, { nullable: true })
  dockerfilePath: string | undefined;

  @Field((type) => AppStatus)
  status: AppStatus;
}

registerEnumType(AppTypes, {
  name: 'AppTypes',
});

registerEnumType(AppStatus, {
  name: 'AppStatus',
});
@ObjectType()
export class AppPaginationInfo extends BasePaginationInfo(App) {}
