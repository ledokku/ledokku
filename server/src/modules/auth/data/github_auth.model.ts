import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class GithubAuthInput {
  @Field((type) => String)
  provider: string;

  @Field((type) => String)
  type: string;

  @Field((type) => String)
  providerAccountId: string;

  @Field((type) => String)
  access_token: string;

  @Field((type) => Int)
  expires_at: number;

  @Field((type) => String)
  refresh_token: string;

  @Field((type) => Int)
  refresh_token_expires_in: number;

  @Field((type) => String)
  token_type: string;
}
