import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class DatabaseInfo { //TODO: innecesario
  @Field((type) => [String])
  info: string[];
}
