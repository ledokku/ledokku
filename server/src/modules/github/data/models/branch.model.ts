import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Branch {
  @Field((type) => String)
  name: string;
}
