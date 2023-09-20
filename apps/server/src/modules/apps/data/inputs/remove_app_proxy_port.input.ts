import { Field, InputType } from 'type-graphql';

@InputType()
export class RemoveAppProxyPortInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  scheme: string;

  @Field((type) => String)
  host: string;

  @Field((type) => String)
  container: string;
}
