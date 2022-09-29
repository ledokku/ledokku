import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EnvVar {
  @Field((type) => String)
  key: string;

  @Field((type) => String)
  value: string;
}
