import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class AppDomain {
  @Field((type) => String)
  domain: string;
}
