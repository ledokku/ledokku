import { Field, InputType } from 'type-graphql';

@InputType()
export class RestartAppInput {
  @Field((type) => String)
  appId: string;
}
