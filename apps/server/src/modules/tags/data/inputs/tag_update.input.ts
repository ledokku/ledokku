import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class TagUpdateInput {
  @Field((type) => ID)
  id: string;

  @Field((type) => [String])
  tags: string[];
}
