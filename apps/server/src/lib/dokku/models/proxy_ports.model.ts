import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ProxyPort {
  @Field((type) => String)
  scheme: string;

  @Field((type) => String)
  host: string;

  @Field((type) => String)
  container: string;
}
