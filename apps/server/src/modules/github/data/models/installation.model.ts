import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Installation {
  @Field((type) => ID)
  id: number;
}
