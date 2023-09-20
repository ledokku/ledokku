import { AppBuild as AppBuildClass, AppBuildStatus } from '@prisma/client';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import { GraphQLDateTime } from '../../../../utils';

@ObjectType()
export class AppBuild implements AppBuildClass {
  @Field((type) => ID)
  id: string;

  @Field((type) => GraphQLDateTime)
  createdAt: Date;

  @Field((type) => GraphQLDateTime)
  updatedAt: Date;

  @Field((type) => ID)
  status: AppBuildStatus;

  @Field((type) => String)
  appId: string;

  @Field((type) => ID, { nullable: true })
  userId: string | null;
}

registerEnumType(AppBuildStatus, {
  name: 'AppBuildStatus',
});
