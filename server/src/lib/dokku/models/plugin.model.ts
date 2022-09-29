import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Plugin {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  version: string;
}
