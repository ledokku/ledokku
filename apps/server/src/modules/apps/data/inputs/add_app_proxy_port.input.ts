import { Field, InputType } from 'type-graphql';

@InputType()
export class AddAppProxyPortInput {
  @Field((type) => String)
  appId: string;

  @Field((type) => String)
  host: string;

  @Field((type) => String)
  container: string;
}
