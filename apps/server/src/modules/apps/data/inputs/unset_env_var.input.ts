import { Field, InputType } from 'type-graphql';

@InputType()
export class UnsetEnvVarInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  key: string;
}
