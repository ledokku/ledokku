import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateAppGithubInput {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  gitRepoFullName: string;

  @Field((type) => String)
  branchName: string;

  @Field((type) => String)
  gitRepoId: string;

  @Field((type) => String, { nullable: true })
  dockerfilePath?: string;

  @Field((type) => String)
  githubInstallationId: string;
}
