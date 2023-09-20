import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateAppDokkuInput {
  @Field((type) => String)
  name: string;
}
