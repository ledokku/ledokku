import { Field, InputType } from 'type-graphql';

@InputType()
export class DestroyAppInput {
  @Field((type) => String)
  appId: string;
}
