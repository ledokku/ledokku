import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Logs {
  @Field((type) => [String])
  logs: string[];
}
