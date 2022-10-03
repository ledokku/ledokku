import { GraphQLDateTime } from './../../../../utils';
import { Activity as ActivityClass, ModelReferences } from '@prisma/client';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Activity implements ActivityClass {
  @Field((type) => String)
  id: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  description: string;

  @Field((type) => GraphQLDateTime)
  createdAt: Date;

  @Field((type) => GraphQLDateTime)
  updatedAt: Date;

  refersToModel: ModelReferences;
  referenceId: string;
  modifierId: string;
}
