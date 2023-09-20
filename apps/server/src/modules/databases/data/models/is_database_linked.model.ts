import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class IsDatabaseLinked {
  @Field((type) => String)
  isLinked: boolean;
}
