import { Field, ObjectType } from 'type-graphql';

@ObjectType() //TODO: Innecesario
export class BooleanResult {
  @Field((type) => Boolean)
  result: boolean;
}
