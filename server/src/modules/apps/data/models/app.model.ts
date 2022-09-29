import { App as AppClass, AppTypes } from '@prisma/client';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
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
}

registerEnumType(AppTypes, {
  name: 'AppTypes',
});
