import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class DomainList {
  @Field((type) => [String])
  domains: string[];
}
