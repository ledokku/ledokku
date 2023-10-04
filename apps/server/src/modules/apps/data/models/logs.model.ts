import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Logs {
  //TODO: Innecesario
  @Field((type) => [String])
  logs: string[];
}
