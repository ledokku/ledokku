import { Field, ObjectType } from 'type-graphql';

@ObjectType() //TODO: Innecesario
export class CreateAppResult {
  @Field((type) => String)
  appId: string;
}
