import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateBranchInput {
  @Field((type) => ID)
  appId: string;

  @Field((type) => String)
  branchName: string;
}
