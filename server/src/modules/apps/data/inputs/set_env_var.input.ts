import { Field, InputType } from 'type-graphql';

@InputType()
export class SetEnvVarInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  key: string;

  @Field((type) => String)
  value: string;
}
