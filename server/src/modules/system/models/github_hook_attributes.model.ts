import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class GithubHookAttributes {
  @Field((type) => String)
  url: string;
}
