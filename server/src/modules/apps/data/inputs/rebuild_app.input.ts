import { Field, InputType } from 'type-graphql';

@InputType()
export class RebuildAppInput {
  @Field((type) => String)
  appId: string;
}
